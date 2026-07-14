import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { getMyEnrolments, checkIsAdmin } from "@/lib/learner.functions";
import { AUTH_STORAGE_KEY, clearSupabaseAuthStorage, expireAuthCookie, getActiveSupabaseSession, supabase } from "@/lib/supabase";
import { whatsappUrl } from "@/lib/lms-config";

export const Route = createFileRoute("/_authenticated/academy/dashboard")({
  head: () => ({ meta: [{ title: "My Dashboard — LoveTech Agro Academy" }] }),
  component: Dashboard,
});

function Dashboard() {
  const fetchEnrolments = useServerFn(getMyEnrolments);
  const fetchAdmin = useServerFn(checkIsAdmin);
  const qc = useQueryClient();
  const [sessionResolved, setSessionResolved] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let mounted = true;
    getActiveSupabaseSession().then((session) => {
      if (!mounted) return;
      setSessionReady(!!session?.access_token);
      setSessionResolved(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSessionReady(!!session?.access_token);
      setSessionResolved(true);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const enrolments = useQuery({
    queryKey: ["enrolments"],
    queryFn: () => fetchEnrolments(),
    enabled: sessionReady,
  });
  const admin = useQuery({
    queryKey: ["isAdmin"],
    queryFn: () => fetchAdmin(),
    enabled: sessionReady,
  });

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await qc.cancelQueries();
      qc.clear();
      expireAuthCookie(AUTH_STORAGE_KEY);
      clearSupabaseAuthStorage();
      try { window.sessionStorage.removeItem("lovetech_post_auth_redirect"); } catch { /* noop */ }
      await supabase.auth.signOut({ scope: "local" });
    } catch (e) {
      console.error("Sign out failed", e);
    } finally {
      window.location.assign("/login");
    }
  }

  return (
    <main className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ochre">Dashboard</p>
            <h1 className="font-serif text-4xl text-vetiver md:text-5xl">My Academy</h1>
            <p className="mt-2 text-sm text-foreground/60">Continue learning, download resources, and track your certificates.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/settings/profile" className="rounded-sm border border-vetiver/30 px-4 py-2 text-sm font-semibold text-vetiver hover:bg-vetiver/5">Profile & notifications</Link>
            <Link to="/academy/referrals" className="rounded-sm border border-ochre/40 px-4 py-2 text-sm font-semibold text-ochre hover:bg-ochre/5">Refer & earn</Link>
            <Link to="/academy/badges" className="rounded-sm border border-ochre/40 px-4 py-2 text-sm font-semibold text-ochre hover:bg-ochre/5">My badges</Link>
            {admin.data?.isAdmin && (
              <Link to="/admin" className="rounded-sm bg-vetiver px-4 py-2 text-sm font-semibold text-bone">Admin</Link>
            )}
            <button type="button" onClick={handleSignOut} disabled={signingOut} className="rounded-sm border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-60">{signingOut ? "Signing out…" : "Sign out"}</button>
          </div>
        </div>

        <section>
          <h2 className="mb-4 font-serif text-2xl text-vetiver">My courses</h2>
          {!sessionResolved && <p className="text-sm text-foreground/60">Checking your session…</p>}
          {sessionResolved && !sessionReady && (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <p className="mb-4 text-foreground/70">Your session could not be verified. Please sign in again to view courses.</p>
              <Link to="/login" className="inline-flex rounded-sm bg-vetiver px-5 py-2.5 text-sm font-semibold text-bone">Sign in</Link>
            </div>
          )}
          {sessionReady && enrolments.isLoading && <p className="text-sm text-foreground/60">Loading…</p>}
          {enrolments.data?.enrolments.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <p className="mb-4 text-foreground/70">You haven't enrolled in a course yet.</p>
              <Link to="/academy" className="inline-flex rounded-sm bg-vetiver px-5 py-2.5 text-sm font-semibold text-bone">Browse Academy</Link>
            </div>
          )}
          <div className="grid gap-4">
            {enrolments.data?.enrolments.map((e) => {
              const course = Array.isArray(e.course) ? e.course[0] : e.course;
              const active = e.access_status === "active";
              return (
                <article key={e.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-6">
                  <div className="flex-1">
                    <h3 className="font-serif text-xl text-vetiver">{course?.title}</h3>
                    <p className="text-sm text-foreground/60">{course?.subtitle}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <Badge label={e.payment_status} kind={e.payment_status === "paid" ? "ok" : "muted"} />
                      <Badge label={e.access_status} kind={active ? "ok" : "muted"} />
                    </div>
                  </div>
                  {active && course?.slug ? (
                    <Link
                      to="/academy/dashboard/courses/$slug"
                      params={{ slug: course.slug }}
                      className="inline-flex items-center gap-2 rounded-sm bg-academy px-4 py-2 text-sm font-semibold text-white"
                    >
                      Continue learning <ArrowRight className="size-4" />
                    </Link>
                  ) : (
                    <span className="text-xs text-foreground/50">Complete payment to unlock</span>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start gap-3">
            <MessageCircle className="size-5 text-vetiver" />
            <div className="flex-1">
              <h3 className="font-serif text-lg text-vetiver">Need help?</h3>
              <p className="text-sm text-foreground/70">Chat with Lovetech support about enrolment, payment, course access or certificates.</p>
              <a href={whatsappUrl()} target="_blank" rel="noreferrer noopener" className="mt-3 inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-4 py-2 text-sm font-semibold text-white">
                WhatsApp support
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Badge({ label, kind }: { label: string; kind: "ok" | "muted" }) {
  return (
    <span className={`rounded-full px-2 py-0.5 font-semibold uppercase tracking-wider ${kind === "ok" ? "bg-vetiver/10 text-vetiver" : "bg-muted text-foreground/60"}`}>{label.replaceAll("_", " ")}</span>
  );
}

