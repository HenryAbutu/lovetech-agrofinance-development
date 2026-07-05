import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Check, Calendar, Clock, MessageCircle, Phone, ShieldCheck, Sparkles, Tag } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { enrolInCourse } from "@/lib/enrolment.functions";
import { validateCoupon } from "@/lib/coupons.functions";
import courseImg from "@/assets/course-ai-edge.jpg";

const SearchSchema = z.object({ ref: z.string().max(60).optional() });

export const Route = createFileRoute("/academy/courses/professionals-ai-edge")({
  validateSearch: (s) => SearchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Enroll · Professionals AI Edge — LoveTech Agro Academy" },
      { name: "description", content: "Practical AI tools for more efficient, productive and profitable businesses. Launch price ₦5,000." },
      { property: "og:title", content: "Professionals AI Edge" },
      { property: "og:description", content: "Practical AI tools for Nigerian professionals and founders. Launch price ₦5,000." },
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
  const validate = useServerFn(validateCoupon);
  const nav = useNavigate();
  const { ref: refFromUrl } = useSearch({ from: "/academy/courses/professionals-ai-edge" });
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState(""); const [err, setErr] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponInfo, setCouponInfo] = useState<{ ok: boolean; message: string; final?: number } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user));
  }, []);

  async function applyCoupon() {
    if (!coupon.trim()) return;
    setCouponInfo({ ok: false, message: "Checking…" });
    try {
      const r = await validate({ data: { code: coupon.trim(), course_slug: "professionals-ai-edge" } });
      if (r.valid) setCouponInfo({ ok: true, message: `Applied — you pay ₦${r.final_amount.toLocaleString()}`, final: r.final_amount });
      else setCouponInfo({ ok: false, message: r.reason });
    } catch (e) {
      setCouponInfo({ ok: false, message: e instanceof Error ? e.message : "Could not check coupon" });
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!authed) { nav({ to: "/login" }); return; }
    setState("loading"); setErr("");
    const fd = new FormData(e.currentTarget);
    const data = {
      course_slug: "professionals-ai-edge",
      ...Object.fromEntries(fd.entries()),
      referral_code: refFromUrl ?? null,
    } as Record<string, string | null>;
    try {
      const r = await enrol({ data: data as never });
      if ("redirect_to" in r && r.redirect_to) { window.location.href = r.redirect_to; return; }
      if (r.stubbed) { setMsg(r.message ?? "You're registered."); setState("done"); }
      else if (r.authorization_url) { window.location.href = r.authorization_url; }
      else { setMsg("You're registered."); setState("done"); }
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Failed"); setState("error"); }
  }

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-bone">
        <div className="absolute inset-0">
          <img src={courseImg} alt="Professional using AI tools" className="h-full w-full object-cover opacity-35" width={1280} height={832} />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.4fr_1fr] lg:px-8 lg:py-28">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--ochre)" }}>
              <Sparkles className="size-3.5" /> Enrolment Open
            </p>
            <h1 className="font-serif text-5xl text-bone md:text-6xl">Professionals AI Edge</h1>
            <p className="mt-5 max-w-2xl text-lg text-bone/75">Practical AI tools for more efficient, productive and profitable businesses. Built for Nigerian professionals, founders and operators.</p>
            <div className="mt-8 flex items-baseline gap-3">
              <span className="text-lg text-bone/40 line-through">₦10,000</span>
              <span className="font-serif text-5xl text-ochre">₦5,000</span>
              <span className="text-sm text-bone/60">launch price</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enrol" className="inline-flex rounded-sm px-6 py-3 text-sm font-semibold text-white" style={{ backgroundColor: "var(--academy)" }}>Enroll Now</a>
              <a href="#modules" className="inline-flex rounded-sm border border-bone/20 px-6 py-3 text-sm font-semibold text-bone hover:bg-bone/10">See modules</a>
            </div>
          </div>
          <aside className="self-end rounded-2xl border border-bone/15 bg-bone/5 p-6 backdrop-blur">
            <h3 className="mb-4 font-serif text-xl text-bone">Course details</h3>
            <ul className="space-y-3 text-sm text-bone/80">
              <li className="flex items-center gap-3"><Calendar className="size-4 text-ochre" /> Rolling enrolment</li>
              <li className="flex items-center gap-3"><Clock className="size-4 text-ochre" /> ~6 weeks · self-paced + Zoom</li>
              <li className="flex items-center gap-3"><MessageCircle className="size-4 text-ochre" /> WhatsApp cohort support</li>
              <li className="flex items-center gap-3"><Phone className="size-4 text-ochre" /> 08026065189</li>
              <li className="flex items-center gap-3"><ShieldCheck className="size-4 text-ochre" /> Secure payment via Paystack</li>
            </ul>
          </aside>
        </div>
      </section>

      {/* Outcomes + modules */}
      <section id="modules" className="px-6 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="mb-6 font-serif text-3xl text-vetiver">What you'll be able to do</h2>
            <ul className="mb-12 grid gap-3 md:grid-cols-2">
              {outcomes.map((o) => (
                <li key={o} className="flex gap-3 rounded-md border border-border bg-card p-4 text-sm text-foreground/80"><Check className="mt-0.5 size-4 shrink-0 text-ochre" />{o}</li>
              ))}
            </ul>
            <h2 className="mb-6 font-serif text-3xl text-vetiver">Course modules</h2>
            <ol className="grid gap-2 md:grid-cols-2">
              {modules.map((m, i) => (
                <li key={m} className="flex gap-4 rounded-md border border-border bg-card p-4">
                  <span className="font-mono text-xs text-ochre">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm text-foreground/80">{m}</span>
                </li>
              ))}
            </ol>
          </div>
          <aside className="h-fit space-y-4">
            <div className="rounded-2xl border border-academy/30 bg-academy/5 p-6">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-academy">Launch cohort</p>
              <p className="font-serif text-3xl text-vetiver">₦5,000</p>
              <p className="mt-1 text-sm text-foreground/60">50% off launch price.</p>
              <a href="#enrol" className="mt-4 block rounded-sm py-2.5 text-center text-sm font-semibold text-white" style={{ backgroundColor: "var(--academy)" }}>Reserve my seat</a>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h4 className="mb-2 font-serif text-lg text-vetiver">Who it's for</h4>
              <p className="text-sm text-foreground/70">Founders, consultants, sales & ops teams, accountants, marketers, agribusiness operators — anyone who wants to use AI to do more, faster.</p>
            </div>
          </aside>
        </div>
      </section>

      {/* Enrolment form */}
      <section id="enrol" className="bg-card border-t border-border px-6 py-20 lg:px-8 scroll-mt-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ochre">Step 2 · Enrolment</p>
          <h2 className="mb-2 font-serif text-4xl text-vetiver">Enroll in Professionals AI Edge</h2>
          <p className="mb-8 text-foreground/70">Complete the form below and proceed to secure payment of ₦5,000.</p>
          {authed === false && (
            <div className="mb-6 rounded-md border border-ochre/30 bg-ochre/5 p-4 text-sm">
              You need to <Link to="/login" className="font-semibold text-vetiver underline">sign in</Link> or <Link to="/signup" className="font-semibold text-vetiver underline">create an account</Link> to enroll.
            </div>
          )}
          {state === "done" ? (
            <div className="rounded-2xl border border-vetiver/30 bg-vetiver/5 p-8">
              <h3 className="mb-2 font-serif text-2xl text-vetiver">You're in. 🎉</h3>
              <p className="text-foreground/75">{msg}</p>
              <Link to="/academy/dashboard" className="mt-6 inline-flex rounded-sm bg-vetiver px-5 py-2.5 text-sm font-semibold text-bone">Go to dashboard</Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-5 rounded-2xl border border-border bg-background p-8 shadow-sm">
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

              <div className="rounded-md border border-dashed border-ochre/40 bg-ochre/5 p-4">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-vetiver">
                  <Tag className="size-4 text-ochre" /> Discount coupon (optional)
                </label>
                <div className="flex gap-2">
                  <input
                    name="coupon_code"
                    value={coupon}
                    onChange={(e) => { setCoupon(e.target.value); setCouponInfo(null); }}
                    placeholder="Enter code"
                    className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm uppercase"
                  />
                  <button type="button" onClick={applyCoupon} className="rounded-md border border-vetiver/40 bg-background px-4 py-2 text-sm font-semibold text-vetiver hover:bg-vetiver/5">Apply</button>
                </div>
                {couponInfo && (
                  <p className={`mt-2 text-sm ${couponInfo.ok ? "text-vetiver" : "text-destructive"}`}>{couponInfo.message}</p>
                )}
                {refFromUrl && (
                  <p className="mt-3 text-xs text-foreground/60">Referred by code <span className="font-mono font-semibold text-vetiver">{refFromUrl.toUpperCase()}</span> — they'll earn a reward when your payment succeeds.</p>
                )}
              </div>

              {err && <p className="text-sm text-destructive">{err}</p>}
              <button
                type={authed ? "submit" : "button"}
                disabled={state === "loading"}
                onClick={(e) => {
                  if (!authed) {
                    e.preventDefault();
                    nav({ to: "/login" });
                  }
                }}
                className="rounded-sm px-6 py-3 font-semibold text-white disabled:opacity-60"
                style={{ backgroundColor: "var(--academy)" }}
              >
                {state === "loading" ? "Processing…" : authed ? "Enroll & Pay ₦5,000" : "Sign in to enroll"}
              </button>
              <p className="text-xs text-foreground/55">By enrolling you agree to our <Link to="/terms" className="underline">terms</Link> and <Link to="/privacy" className="underline">privacy policy</Link>.</p>
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
