import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { canonicalLink } from "@/lib/seo";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Check, Calendar, Clock, MessageCircle, Phone, ShieldCheck, Sparkles, Tag } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { getActiveSupabaseSession, supabase } from "@/lib/supabase";
import { enrolInCourse, SINGLE_MODULE_OPTIONS } from "@/lib/enrolment.functions";
import { validateCoupon } from "@/lib/coupons.functions";
import courseImg from "@/assets/course-ai-edge.jpg";
import { LegalNotice } from "@/components/legal-notice";

const SearchSchema = z.object({ ref: z.string().max(60).optional() });

export const Route = createFileRoute("/academy/courses/professionals-ai-edge")({
  validateSearch: (s) => SearchSchema.parse(s),
  head: () => ({
    links: [canonicalLink("/academy/courses/professionals-ai-edge")],
    meta: [
      { title: "Enroll · AI for Work & Business — LoveTech Agro Academy" },
      { name: "description", content: "Practical AI skills to work smarter, grow your business, and stay ahead. ₦25,000 for all 5 modules, or ₦15,000 per module." },
      { property: "og:title", content: "AI for Work & Business" },
      { property: "og:description", content: "Practical AI skills for professionals, teams and business owners. ₦25,000 for all 5 modules, or ₦15,000 per module." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

const outcomes = [
  "Use AI to write, plan and communicate faster and better.",
  "Automate everyday tasks across work, admin and operations.",
  "Apply AI to marketing, sales, service and customer support.",
  "Make smarter decisions using AI-assisted data analysis.",
  "Use AI responsibly, safely and confidently in your context.",
];

const modules = [
  "Foundations: what AI is and how to use it well",
  "Productivity: writing, research, summarising and planning",
  "Marketing & content with AI",
  "Sales, leads and customer engagement",
  "Operations, workflows and document handling",
  "Working with data and simple analysis",
  "Building simple AI assistants (no-code)",
  "Ethics, safety and responsible use",
  "Putting it together: your personal AI workflow",
  "Capstone: apply AI to a real task in your work or business",
];

function Page() {
  const enrol = useServerFn(enrolInCourse);
  const validate = useServerFn(validateCoupon);
  const nav = useNavigate();
  const { ref: refFromUrl } = useSearch({ from: "/academy/courses/professionals-ai-edge" });
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<{ full_name: string; email: string; phone: string; business_name: string; location: string } | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState(""); const [err, setErr] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponInfo, setCouponInfo] = useState<{ ok: boolean; message: string; final?: number } | null>(null);
  const [mainChallenge, setMainChallenge] = useState("");
  const [plan, setPlan] = useState<"bundle" | "single_module">("bundle");
  const [moduleChoice, setModuleChoice] = useState("");
  const singleModules = SINGLE_MODULE_OPTIONS["professionals-ai-edge"].modules;

  useEffect(() => {
    async function loadProfile(userId: string, email: string, metaName = "") {
      const { data } = await supabase.from("profiles").select("full_name, email, phone, business_name, location").eq("id", userId).maybeSingle();
      setProfile({
        full_name: data?.full_name || metaName || (email ? email.split("@")[0] : ""),
        email: data?.email || email,
        phone: data?.phone ?? "",
        business_name: data?.business_name ?? "",
        location: data?.location ?? "",
      });
    }
    getActiveSupabaseSession().then((session) => {
      setAuthed(!!session?.user);
      if (session?.user) loadProfile(session.user.id, session.user.email ?? "", String(session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? ""));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session?.user);
      if (session?.user) loadProfile(session.user.id, session.user.email ?? "", String(session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? ""));
      else setProfile(null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function applyCoupon() {
    const code = coupon.trim();
    if (!code) return;
    setCouponInfo({ ok: false, message: "Checking…" });
    try {
      const r = await validate({ data: { code, course_slug: "professionals-ai-edge" } });
      if (r.valid) {
        setCouponInfo({ ok: true, message: `Applied — you pay ₦${r.final_amount.toLocaleString()}`, final: r.final_amount });
        toast.success(`Coupon applied — new price ₦${r.final_amount.toLocaleString()}`);
      } else {
        setCouponInfo({ ok: false, message: r.reason });
        toast.error(r.reason);
      }
    } catch (e) {
      const m = e instanceof Error ? e.message : "Could not check coupon";
      setCouponInfo({ ok: false, message: m });
      toast.error(m);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (authed === false) { nav({ to: "/login" }); return; }
    if (!authed) return;
    setState("loading"); setErr("");
    const fd = new FormData(e.currentTarget);
    const formEntries = Object.fromEntries(fd.entries()) as Record<string, string>;
    const data: Record<string, string | null> = {
      course_slug: "professionals-ai-edge",
      ...formEntries,
      referral_code: refFromUrl ?? null,
      purchase_option: plan,
      module_choice: plan === "single_module" ? moduleChoice : null,
    };
    if (plan === "single_module" && !moduleChoice) {
      setState("idle"); toast.error("Please choose a module"); return;
    }
    if (profile) {
      data.full_name = (data.full_name as string) || profile.full_name;
      data.email = (data.email as string) || profile.email;
      data.phone = (data.phone as string) || profile.phone;
      data.business_name = (data.business_name as string) || profile.business_name;
      data.location = (data.location as string) || profile.location;
      if (!data.main_challenge) data.main_challenge = mainChallenge;
    }
    if (!data.full_name || !data.email) {
      setState("error");
      setErr("Your profile is missing a name or email. Please update your profile before enrolling.");
      toast.error("Please complete your profile first.");
      return;
    }
    try {
      const r = await enrol({ data: data as never });
      if ("redirect_to" in r && r.redirect_to) { toast.success("Enrolment confirmed"); window.location.href = r.redirect_to; return; }
      if (r.stubbed) { setMsg(r.message ?? "You're registered."); setState("done"); toast.success("You're registered"); }
      else if (r.authorization_url) { toast.message("Redirecting to Paystack…"); window.location.href = r.authorization_url; }
      else { setMsg("You're registered."); setState("done"); }
    } catch (e2) {
      const m = e2 instanceof Error ? e2.message : "Failed";
      setErr(m); setState("error"); toast.error(m);
    }
  }

  const basePrice = plan === "single_module" ? 15000 : 25000;
  const finalAmount = plan === "bundle" && couponInfo?.ok && typeof couponInfo.final === "number" ? couponInfo.final : basePrice;
  const isFree = finalAmount <= 0;
  const priceLabel = isFree ? "Enroll Now (Free)" : `Enroll & Pay ₦${finalAmount.toLocaleString()}${plan === "single_module" && couponInfo?.ok ? " (coupon applied at checkout)" : ""}`;

  return (
    <main className="website web-course">
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-bone">
        <div className="absolute inset-0">
          <img src={courseImg} alt="People using AI tools at work" className="h-full w-full object-cover" width={1280} height={832} />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.4fr_1fr] lg:px-8 lg:py-20">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--ochre)" }}>
              <Sparkles className="size-3.5" /> Enrolment Open
            </p>
            <h1 className="font-serif text-5xl text-bone md:text-6xl">AI for Work & Business</h1>
            <p className="mt-5 max-w-2xl text-lg text-bone/75">A practical, beginner-friendly course to help you use AI to work smarter, save time, and grow — whether you're a professional, team member, founder or business owner.</p>
            <div className="mt-8 flex items-baseline gap-3">
              
              <span className="font-serif text-5xl text-ochre">₦25,000</span>
              <span className="text-sm text-bone/60">5-module bundle · or ₦15,000 per module</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enrol" className="inline-flex rounded-sm px-6 py-3 text-sm font-semibold text-white" style={{ backgroundColor: "var(--academy)" }}>Enroll Now</a>
              <a href="#modules" className="inline-flex rounded-sm border border-bone/20 px-6 py-3 text-sm font-semibold text-bone hover:bg-bone/10">See what you'll learn</a>
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

      {/* Enrolment form — placed first for easy access */}
      <section id="enrol" className="bg-card border-b border-border px-6 py-16 lg:px-8 scroll-mt-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ochre">Enrol now</p>
          <h2 className="mb-2 font-serif text-4xl text-vetiver">Reserve your seat</h2>
          <p className="mb-8 text-foreground/70">Complete the short form below and pay securely: ₦25,000 for the full 5-module bundle, or ₦15,000 for a single module.</p>
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
              {authed ? (
                <div className="rounded-md border border-vetiver/25 bg-vetiver/5 p-4 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-vetiver/70">Enrolling as</p>
                  <p className="mt-1 font-serif text-lg text-vetiver">{profile?.full_name || "Your profile"}</p>
                  <p className="text-foreground/70">{profile?.email || "—"}{profile?.phone ? ` · ${profile.phone}` : ""}</p>
                  <p className="mt-2 text-xs text-foreground/55">Details are taken from your account. <Link to="/settings/profile" className="underline">Update profile</Link>.</p>
                  <div className="mt-4">
                    <label className="mb-1 block text-sm font-medium text-foreground/80">Main challenge you want AI to solve (optional)</label>
                    <textarea aria-label="Main challenge you want AI to help with" name="main_challenge" rows={3} value={mainChallenge} onChange={(e) => setMainChallenge(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
                  </div>
                </div>
              ) : (
                <>
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
                    <textarea aria-label="Main challenge you want AI to help with" name="main_challenge" rows={3} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
                  </div>
                  <Field name="referral_source" label="How did you hear about us?" />
                </>
              )}

              <fieldset className="rounded-md border border-border p-4">
                <legend className="px-1 text-sm font-medium text-vetiver">Choose your option</legend>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className={`cursor-pointer rounded-md border p-3 text-sm ${plan === "bundle" ? "border-vetiver bg-vetiver/5" : "border-border"}`}>
                    <input type="radio" name="plan" className="mr-2" checked={plan === "bundle"} onChange={() => setPlan("bundle")} />
                    <span className="font-semibold">Full bundle — ₦25,000</span>
                    <span className="block text-xs text-foreground/60">All 5 modules</span>
                  </label>
                  <label className={`cursor-pointer rounded-md border p-3 text-sm ${plan === "single_module" ? "border-vetiver bg-vetiver/5" : "border-border"}`}>
                    <input type="radio" name="plan" className="mr-2" checked={plan === "single_module"} onChange={() => setPlan("single_module")} />
                    <span className="font-semibold">Single module — ₦15,000</span>
                    <span className="block text-xs text-foreground/60">Pick one module</span>
                  </label>
                </div>
                {plan === "single_module" && (
                  <select aria-label="Choose a module" required value={moduleChoice} onChange={(e) => setModuleChoice(e.target.value)} className="mt-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                    <option value="">Select a module…</option>
                    {singleModules.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                )}
              </fieldset>

              <div className="rounded-md border border-dashed border-ochre/40 bg-ochre/5 p-4">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-vetiver">
                  <Tag className="size-4 text-ochre" /> Discount coupon (optional)
                </label>
                <div className="flex gap-2">
                  <input
                    aria-label="Discount coupon (optional)"
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
                type={authed === true ? "submit" : "button"}
                disabled={state === "loading" || authed === null}
                onClick={(e) => {
                  if (authed === false) {
                    e.preventDefault();
                    nav({ to: "/login" });
                  }
                }}
                className="rounded-sm px-6 py-3 font-semibold text-white disabled:opacity-60"
                style={{ backgroundColor: "var(--academy)" }}
              >
                {state === "loading" ? "Processing…" : authed === null ? "Checking…" : authed ? priceLabel : "Sign in to enroll"}
              </button>
              <LegalNotice action="enrolling or proceeding to payment" />
            </form>
          )}
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
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-academy">Course fee</p>
              <p className="font-serif text-3xl text-vetiver">₦25,000</p>
              <p className="mt-1 text-sm text-foreground/60">Full 5-module bundle. Single modules are ₦15,000 each.</p>
              <a href="#enrol" className="mt-4 block rounded-sm py-2.5 text-center text-sm font-semibold text-white" style={{ backgroundColor: "var(--academy)" }}>Reserve my seat</a>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h4 className="mb-2 font-serif text-lg text-vetiver">Who it's for</h4>
              <p className="text-sm text-foreground/70">Professionals, founders, teams, entrepreneurs, students and anyone who wants practical AI skills — no technical background needed.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Field({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-foreground/80">{label}{required && " *"}</label>
      <input id={name} name={name} type={type} required={required} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
    </div>
  );
}
