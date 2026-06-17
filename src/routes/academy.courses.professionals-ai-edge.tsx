import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Check, Calendar, Clock, MessageCircle, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { enrolInCourse } from "@/lib/enrolment.functions";
import courseImg from "@/assets/course-ai-edge.jpg";

export const Route = createFileRoute("/academy/courses/professionals-ai-edge")({
  head: () => ({
    meta: [
      { title: "Enroll · Professionals AI Edge — LoveTech Agro Academy" },
      { name: "description", content: "Practical AI tools for more efficient, productive and profitable businesses. Launch price ₦1,000. Deadline 15 June 2026." },
      { property: "og:title", content: "Professionals AI Edge" },
      { property: "og:description", content: "Practical AI tools for Nigerian professionals and founders. Launch price ₦1,000." },
      { property: "og:image", content: courseImg },
    ],
  }),
  component: Page,
});

const outcomes = [
  "Use AI to write proposals, emails, marketing and reports in minutes.",
  "Automate routine tasks across sales, ops and admin.",
  "Build a simple AI-powered customer support and lead system.",
  "Use AI to analyse business data and spot opportunities.",
  "Apply AI ethically and safely in a Nigerian business context.",
];

const modules = [
  "Foundations: what AI can and can't do for your business",
  "Productivity stack: writing, research, summarisation",
  "Marketing & content with AI",
  "Sales, leads and customer support automation",
  "Operations: SOPs, workflows and document handling",
  "Data: analysing your business numbers with AI",
  "Building simple AI assistants (no-code)",
  "Ethics, safety and compliance",
  "Putting it together: your AI operating system",
  "Capstone: ship one AI workflow that saves you a day per week",
];

function Page() {
  const enrol = useServerFn(enrolInCourse);
  const nav = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState(""); const [err, setErr] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user));
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!authed) { nav({ to: "/login" }); return; }
    setState("loading"); setErr("");
    const fd = new FormData(e.currentTarget);
    const data = { course_slug: "professionals-ai-edge", ...Object.fromEntries(fd.entries()) } as Record<string, string>;
    try {
      const r = await enrol({ data: data as never });
      if (r.stubbed) { setMsg(r.message ?? "You're registered."); setState("done"); }
      else if (r.authorization_url) { window.location.href = r.authorization_url; }
      else { setMsg("You're registered."); setState("done"); }
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Failed"); setState("error"); }
  }

  return (
    <main>
      <section className="bg-ink px-6 py-20 text-bone lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--ochre)" }}>Enrolment Open · Deadline 15 June 2026</p>
          <h1 className="font-serif text-5xl text-bone md:text-6xl">Professionals AI Edge</h1>
          <p className="mt-5 max-w-2xl text-lg text-bone/70">Practical AI tools for more efficient, productive and profitable businesses. Built for Nigerian professionals, founders and operators.</p>
          <div className="mt-8 flex items-baseline gap-3">
            <span className="text-lg text-bone/40 line-through">₦10,000</span>
            <span className="font-serif text-5xl text-ochre">₦1,000</span>
            <span className="text-sm text-bone/60">launch price</span>
          </div>
          <a href="#enrol" className="mt-8 inline-flex rounded-sm px-6 py-3 text-sm font-semibold text-white" style={{ backgroundColor: "var(--academy)" }}>Enroll Now</a>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="mb-6 font-serif text-3xl text-vetiver">What you'll be able to do</h2>
            <ul className="mb-12 grid gap-3">
              {outcomes.map((o) => (
                <li key={o} className="flex gap-3 text-foreground/80"><Check className="mt-1 size-4 shrink-0 text-ochre" />{o}</li>
              ))}
            </ul>
            <h2 className="mb-6 font-serif text-3xl text-vetiver">Course modules</h2>
            <ol className="grid gap-2">
              {modules.map((m, i) => (
                <li key={m} className="flex gap-4 rounded-md border border-border bg-card p-4">
                  <span className="font-mono text-xs text-ochre">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-foreground/80">{m}</span>
                </li>
              ))}
            </ol>
          </div>
          <aside className="h-fit rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-4 font-serif text-2xl text-vetiver">Course details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-foreground/60">Delivery</dt><dd className="font-medium">Online · Self-paced + Zoom</dd></div>
              <div className="flex justify-between"><dt className="text-foreground/60">Duration</dt><dd className="font-medium">~6 weeks</dd></div>
              <div className="flex justify-between"><dt className="text-foreground/60">Deadline</dt><dd className="font-medium">15 June 2026</dd></div>
              <div className="flex justify-between"><dt className="text-foreground/60">Support</dt><dd className="font-medium">WhatsApp cohort</dd></div>
              <div className="flex justify-between"><dt className="text-foreground/60">Contact</dt><dd className="font-medium">08026065189</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section id="enrol" className="bg-card border-t border-border px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-2 font-serif text-4xl text-vetiver">Enroll in Professionals AI Edge</h2>
          <p className="mb-8 text-foreground/70">Complete enrolment and proceed to secure payment.</p>
          {authed === false && (
            <div className="mb-6 rounded-md border border-ochre/30 bg-ochre/5 p-4 text-sm">
              You need to <Link to="/login" className="font-semibold text-vetiver underline">sign in</Link> or <Link to="/signup" className="font-semibold text-vetiver underline">create an account</Link> to enroll.
            </div>
          )}
          {state === "done" ? (
            <div className="rounded-2xl border border-vetiver/30 bg-vetiver/5 p-8">
              <h3 className="mb-2 font-serif text-2xl text-vetiver">You're in.</h3>
              <p className="text-foreground/75">{msg}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-5 rounded-2xl border border-border bg-background p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <Field name="full_name" label="Full name" required />
                <Field name="email" type="email" label="Email" required />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field name="phone" label="Phone (WhatsApp)" />
                <Field name="business_name" label="Business / role" />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field name="business_sector" label="Sector / industry" />
                <Field name="location" label="Location" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground/80">Main challenge you want AI to solve</label>
                <textarea name="main_challenge" rows={3} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
              </div>
              <Field name="referral_source" label="How did you hear about us?" />
              {err && <p className="text-sm text-destructive">{err}</p>}
              <button disabled={state === "loading" || !authed} className="rounded-sm px-6 py-3 font-semibold text-white disabled:opacity-60" style={{ backgroundColor: "var(--academy)" }}>
                {state === "loading" ? "Processing…" : authed ? "Enroll & Pay ₦1,000" : "Sign in to enroll"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

function Field({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground/80">{label}{required && " *"}</label>
      <input name={name} type={type} required={required} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
    </div>
  );
}
