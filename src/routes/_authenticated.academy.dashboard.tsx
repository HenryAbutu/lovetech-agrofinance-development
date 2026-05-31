import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getMyEnrolments, checkIsAdmin } from "@/lib/learner.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/academy/dashboard")({
  head: () => ({ meta: [{ title: "My Dashboard — LoveTech Academy" }] }),
  component: Dashboard,
});

function Dashboard() {
  const fetchEnrolments = useServerFn(getMyEnrolments);
  const fetchAdmin = useServerFn(checkIsAdmin);
  const enrolments = useQuery({ queryKey: ["enrolments"], queryFn: () => fetchEnrolments() });
  const admin = useQuery({ queryKey: ["isAdmin"], queryFn: () => fetchAdmin() });

  return (
    <main className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ochre">Dashboard</p>
            <h1 className="font-serif text-4xl text-vetiver md:text-5xl">My Academy</h1>
          </div>
          <div className="flex gap-3">
            {admin.data?.isAdmin && (
              <Link to="/admin/video-studio" className="rounded-sm bg-vetiver px-4 py-2 text-sm font-semibold text-bone">Video Studio</Link>
            )}
            <button onClick={() => supabase.auth.signOut()} className="rounded-sm border border-border px-4 py-2 text-sm font-medium hover:bg-muted">Sign out</button>
          </div>
        </div>

        <section>
          <h2 className="mb-4 font-serif text-2xl text-vetiver">My courses</h2>
          {enrolments.isLoading && <p className="text-sm text-foreground/60">Loading…</p>}
          {enrolments.data?.enrolments.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <p className="mb-4 text-foreground/70">You haven't enrolled in a course yet.</p>
              <Link to="/academy" className="inline-flex rounded-sm bg-vetiver px-5 py-2.5 text-sm font-semibold text-bone">Browse Academy</Link>
            </div>
          )}
          <div className="grid gap-4">
            {enrolments.data?.enrolments.map((e) => {
              const course = Array.isArray(e.course) ? e.course[0] : e.course;
              return (
                <article key={e.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-6">
                  <div>
                    <h3 className="font-serif text-xl text-vetiver">{course?.title}</h3>
                    <p className="text-sm text-foreground/60">{course?.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <Badge label={e.payment_status} kind={e.payment_status === "paid" ? "ok" : "muted"} />
                    <Badge label={e.access_status} kind={e.access_status === "active" ? "ok" : "muted"} />
                  </div>
                </article>
              );
            })}
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
