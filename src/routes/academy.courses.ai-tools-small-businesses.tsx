import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Check, Clock, MessageCircle, Phone, ShieldCheck, Sparkles, PlayCircle, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { enrolInCourse } from "@/lib/enrolment.functions";
import { whatsappUrl } from "@/lib/lms-config";
import courseImg from "@/assets/course-ai-tools.jpg";

export const Route = createFileRoute("/academy/courses/ai-tools-small-businesses")({
  head: () => ({
    meta: [
      { title: "AI for Businesses: Practical AI Skills for Nigerian SMEs — Lovetech Business Academy" },
      { name: "description", content: "30-minute beginner course: use ChatGPT, Canva AI, CapCut & HeyGen to grow your Nigerian small business. Launch price ₦5,000." },
      { property: "og:title", content: "AI for Businesses: Practical AI Skills for Nigerian SMEs" },
      { property: "og:description", content: "Practical 30-minute beginner course. Launch price ₦5,000." },
      { property: "og:image", content: courseImg },
    ],
  }),
  component: Page,
});

const outcomes = [
  "Explain AI in simple business language",
  "Identify business tasks AI can improve",
  "Write effective prompts using the Role + Task + Context formula",
  "Create a 7-day content plan",
  "Design a Canva flyer with AI",
  "Write a 30-second advert script",
  "Use AI for customer messages & business planning",
  "Build a 7-day AI action plan",
  "Submit a final AI Business Action Pack",
];

const audience = [
  "Small business owners & entrepreneurs",
  "Online vendors, food vendors, restaurants",
  "Fashion designers, salons, agro-businesses",
  "Consultants, trainers, event planners",
  "Short-let owners, logistics, small manufacturers",
];

const modules = [
  { n: 1, title: "Welcome & Course Introduction" },
  { n: 2, title: "What AI Can Do for Your Business" },
  { n: 3, title: "Prompt Writing for Business Owners" },
  { n: 4, title: "AI for Content & Social Media" },
  { n: 5, title: "Canva AI for Flyers & Branding" },
  { n: 6, title: "AI for Short Videos & Adverts" },
  { n: 7, title: "AI for Customer Messages, Planning & Productivity" },
  { n: 8, title: "Your 7-Day AI Action Plan" },
  { n: 9, title: "Final Assignment, Assessment & Certificate" },
];

const finalOutputs = [
  "A list of business tasks where AI can help you",
  "A personal prompt bank",
  "A 7-day content plan",
  "A Canva flyer idea or design",
  "A 30-second business video script",
  "A simple 7-day AI action plan",
  "A final AI Business Action Pack",
];

const includes = [
  { icon: PlayCircle, label: "Video lessons & practical demonstrations" },
  { icon: Download, label: "Downloadable participant handbook & templates" },
  { icon: Check, label: "Practical assignments" },
  { icon: Phone, label: "WhatsApp support" },
  { icon: Sparkles, label: "Final AI Business Action Pack" },
  { icon: ShieldCheck, label: "Certificate eligibility" },
];

function Page() {
  const enrol = useServerFn(enrolInCourse);
  const nav = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user));
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!authed) { nav({ to: "/login" }); return; }
    setState("loading"); setErr("");
    const fd = new FormData(e.currentTarget);
    const data = { course_slug: "ai-tools-small-businesses", ...Object.fromEntries(fd.entries()) } as Record<string, string>;
    try {
      const r = await enrol({ data: data as never });
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
          <img src={courseImg} alt="Nigerian entrepreneur using AI on phone" className="h-full w-full object-cover opacity-40" width={1280} height={832} />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.4fr_1fr] lg:px-8 lg:py-28">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--ochre)" }}>
              <Sparkles className="size-3.5" /> Lovetech AI Business Academy · Enrolment Open
            </p>
            <h1 className="font-serif text-4xl text-bone md:text-6xl">AI Tools for Small Businesses</h1>
            <p className="mt-3 font-serif text-xl text-ochre md:text-2xl">Practical Beginner Course</p>
            <p className="mt-5 max-w-2xl text-base text-bone/80 md:text-lg">
              Learn how to use ChatGPT, Canva AI, and video tools to create content, flyers, customer messages, business documents, and simple adverts for your small business.
            </p>
            <div className="mt-8 flex items-baseline gap-3">
              <span className="text-lg text-bone/40 line-through">₦15,000</span>
              <span className="font-serif text-5xl text-ochre">₦5,000</span>
              <span className="text-sm text-bone/60">launch price</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enrol" className="inline-flex rounded-sm px-6 py-3 text-sm font-semibold text-white" style={{ backgroundColor: "var(--academy)" }}>Enrol Now</a>
              <Link to="/signup" className="inline-flex rounded-sm border border-bone/20 px-6 py-3 text-sm font-semibold text-bone hover:bg-bone/10">Create Learner Account</Link>
              <a href={whatsappUrl("Hi, I have questions about the AI Tools course.")} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-6 py-3 text-sm font-semibold text-white">
                <MessageCircle className="size-4" /> Ask on WhatsApp
              </a>
            </div>
          </div>
          <aside className="self-end rounded-2xl border border-bone/15 bg-bone/5 p-6 backdrop-blur">
            <h3 className="mb-4 font-serif text-xl text-bone">This course includes</h3>
            <ul className="space-y-3 text-sm text-bone/85">
              {includes.map((i) => (
                <li key={i.label} className="flex items-center gap-3"><i.icon className="size-4 text-ochre" /> {i.label}</li>
              ))}
              <li className="flex items-center gap-3 pt-2 border-t border-bone/10"><Clock className="size-4 text-ochre" /> Self-paced · lifetime access</li>
              <li className="flex items-center gap-3"><Phone className="size-4 text-ochre" /> WhatsApp support</li>
            </ul>
          </aside>
        </div>
      </section>

      {/* Description */}
      <section className="border-b border-border bg-card px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 font-serif text-3xl text-vetiver">About this course</h2>
          <p className="mb-6 text-foreground/75 leading-relaxed">
            This beginner-friendly online course by <strong>Lovetech AI Business Academy</strong> under Lovetech Agrofinance & Development helps Nigerian and African small business owners use AI tools practically. Learners will use ChatGPT or Claude, Canva AI, CapCut, HeyGen, and Canva Video to create useful business outputs such as social media captions, content plans, flyers, customer replies, video scripts, business documents, and a simple AI action plan.
          </p>
          <h3 className="mb-3 mt-8 font-serif text-xl text-vetiver">Who this is for</h3>
          <ul className="grid gap-2 md:grid-cols-2">
            {audience.map((a) => (
              <li key={a} className="flex items-start gap-2 text-sm text-foreground/75"><Check className="mt-0.5 size-4 shrink-0 text-ochre" />{a}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Outcomes + Curriculum */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="mb-6 font-serif text-3xl text-vetiver">What you will learn</h2>
            <ul className="mb-12 grid gap-3 md:grid-cols-2">
              {outcomes.map((o) => (
                <li key={o} className="flex gap-3 rounded-md border border-border bg-card p-4 text-sm text-foreground/80"><Check className="mt-0.5 size-4 shrink-0 text-ochre" />{o}</li>
              ))}
            </ul>
            <h2 className="mb-6 font-serif text-3xl text-vetiver">Course curriculum</h2>
            <ol className="grid gap-3">
              {modules.map((m) => (
                <li key={m.n} className="flex items-center gap-4 rounded-md border border-border bg-card p-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-vetiver/10 font-mono text-sm text-vetiver">{String(m.n).padStart(2, "0")}</span>
                  <span className="text-sm font-medium text-foreground/85">Module {m.n}: {m.title}</span>
                </li>
              ))}
            </ol>
          </div>
          <aside className="h-fit space-y-4">
            <div className="rounded-2xl border border-academy/30 bg-academy/5 p-6">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-academy">Launch price</p>
              <div className="flex items-baseline gap-2">
                <p className="font-serif text-4xl text-vetiver">₦5,000</p>
                <p className="text-sm text-foreground/50 line-through">₦15,000</p>
              </div>
              <p className="mt-1 text-sm text-foreground/60">Save ₦10,000 during launch.</p>
              <a href="#enrol" className="mt-4 block rounded-sm py-2.5 text-center text-sm font-semibold text-white" style={{ backgroundColor: "var(--academy)" }}>Enrol Now</a>
              <Link to="/signup" className="mt-2 block rounded-sm border border-vetiver/20 py-2.5 text-center text-sm font-semibold text-vetiver hover:bg-vetiver/5">Create Learner Account</Link>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h4 className="mb-2 font-serif text-lg text-vetiver">Need help?</h4>
              <p className="text-sm text-foreground/70">Chat with our support team about enrolment, payment or course access.</p>
              <a href={whatsappUrl()} target="_blank" rel="noreferrer noopener" className="mt-3 inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-4 py-2 text-sm font-semibold text-white">
                <MessageCircle className="size-4" /> WhatsApp Support
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* Enrolment form */}
      <section id="enrol" className="scroll-mt-20 border-t border-border bg-card px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ochre">Enrolment</p>
          <h2 className="mb-2 font-serif text-4xl text-vetiver">Enrol in AI Tools for Small Businesses</h2>
          <p className="mb-8 text-foreground/70">Complete the form below and proceed to secure payment of ₦5,000 via Paystack.</p>
          {authed === false && (
            <div className="mb-6 rounded-md border border-ochre/30 bg-ochre/5 p-4 text-sm">
              You need to <Link to="/login" className="font-semibold text-vetiver underline">sign in</Link> or <Link to="/signup" className="font-semibold text-vetiver underline">create an account</Link> to enrol.
            </div>
          )}
          {state === "done" ? (
            <div className="rounded-2xl border border-vetiver/30 bg-vetiver/5 p-8">
              <h3 className="mb-2 font-serif text-2xl text-vetiver">You're in. 🎉</h3>
              <p className="text-foreground/75">{msg}</p>
              <Link to="/academy/dashboard" className="mt-6 inline-flex rounded-sm bg-vetiver px-5 py-2.5 text-sm font-semibold text-bone">Go to my dashboard</Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-5 rounded-2xl border border-border bg-background p-8 shadow-sm">
              <div className="grid gap-5 md:grid-cols-2">
                <Field name="full_name" label="Full name" required />
                <Field name="email" type="email" label="Email" required />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field name="phone" label="Phone (WhatsApp)" />
                <Field name="business_name" label="Business name" />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field name="business_sector" label="Business sector" />
                <Field name="location" label="Location" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground/80">What do you want AI to help you with?</label>
                <textarea name="main_challenge" rows={3} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
              </div>
              <Field name="referral_source" label="How did you hear about us?" />
              {err && <p className="text-sm text-destructive">{err}</p>}
              <button
                type={authed ? "submit" : "button"}
                disabled={state === "loading"}
                onClick={(e) => { if (!authed) { e.preventDefault(); nav({ to: "/login" }); } }}
                className="rounded-sm px-6 py-3 font-semibold text-white disabled:opacity-60"
                style={{ backgroundColor: "var(--academy)" }}
              >
                {state === "loading" ? "Processing…" : authed ? "Enrol & Pay ₦5,000" : "Sign in to enrol"}
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
