import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { FileCheck2, Building2, Receipt, TrendingUp, AlertTriangle, Target, ScrollText, ClipboardCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { submitDiagnostic } from "@/lib/forms.functions";

export const Route = createFileRoute("/finance-readiness")({
  head: () => ({
    meta: [
      { title: "Finance Readiness Diagnostic — LoveTech" },
      { name: "description", content: "Free diagnostic to assess your business's readiness for loans, grants and investment." },
      { property: "og:title", content: "Finance Readiness Diagnostic" },
      { property: "og:description", content: "A practical readiness assessment for MSMEs, agribusinesses and cooperatives seeking funding." },
    ],
  }),
  component: DiagnosticPage,
});

const checks = [
  { icon: Building2, t: "Business structure", b: "Is your business structured, positioned and documented in a way funders can understand?" },
  { icon: FileCheck2, t: "Registration and compliance", b: "CAC status, tax registration and sector permits that funders expect to see." },
  { icon: Receipt, t: "Sales and expense records", b: "Do you have organised records that tell a credible business story?" },
  { icon: TrendingUp, t: "Cashflow and funding need", b: "Can you clearly show what money moves through the business and why you need more?" },
  { icon: AlertTriangle, t: "Existing debts and obligations", b: "Understanding your current exposure before you take on more capital." },
  { icon: Target, t: "Funding purpose", b: "How the money will be used and the business outcome it produces." },
  { icon: ScrollText, t: "Repayment or accountability logic", b: "How the business will repay a loan or steward a grant responsibly." },
  { icon: ClipboardCheck, t: "Readiness gaps", b: "What's still missing that funders will flag — before they flag it." },
];

const steps = [
  "We review your diagnostic information",
  "We identify your finance readiness level",
  "We send a summary of key gaps and next steps",
  "You may upgrade to a full Finance Readiness Pack or consulting support",
];

function DiagnosticPage() {
  const submit = useServerFn(submitDiagnostic);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("loading"); setErr("");
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    try {
      await submit({ data: data as never });
      setState("done");
      form.reset();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Failed to submit");
      setState("error");
    }
  }

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="border-b border-border bg-gradient-to-br from-[#FFF8E7] via-white to-white px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ochre">Diagnostic</p>
          <h1 className="font-serif text-4xl text-vetiver md:text-6xl">Finance Readiness Diagnostic</h1>
          <p className="mt-5 max-w-3xl text-lg text-foreground/70">
            A practical assessment of how ready your business is for a loan, grant or investment.
            Tell us about your business and we'll come back with your readiness summary and the specific gaps to close first.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#diagnostic" className="rounded-lg bg-vetiver px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95">Start My Diagnostic</a>
            <Link to="/contact" search={{ service: "Finance Readiness Pack" } as never} className="rounded-lg bg-ochre px-6 py-3 text-sm font-semibold text-ink shadow-sm hover:opacity-95">Request Full Finance Readiness Pack</Link>
          </div>
        </div>
      </section>

      {/* WHAT WE CHECK */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal">What we check</p>
            <h2 className="font-serif text-3xl text-vetiver md:text-4xl">What the Finance Readiness Diagnostic Checks</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {checks.map(({ icon: Icon, ...c }) => (
              <div key={c.t} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="mb-4 grid size-11 place-items-center rounded-lg bg-vetiver/10 text-vetiver">
                  <Icon className="size-5" />
                </div>
                <h3 className="mb-1.5 font-serif text-lg text-vetiver">{c.t}</h3>
                <p className="text-sm text-foreground/65">{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT HAPPENS AFTER */}
      <section className="border-y border-border bg-[#FFF8E7] px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal">Your next steps</p>
            <h2 className="font-serif text-3xl text-vetiver md:text-4xl">What Happens After You Submit</h2>
          </div>
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="mb-3 font-mono text-xs font-semibold text-ochre">STEP {String(i + 1).padStart(2, "0")}</div>
                <p className="font-serif text-lg leading-snug text-vetiver">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FORM */}
      <section id="diagnostic" className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {state === "done" ? (
            <div className="rounded-2xl border border-vetiver/25 bg-vetiver/5 p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-vetiver/10 text-vetiver">
                <CheckCircle2 className="size-6" />
              </div>
              <h2 className="mb-3 font-serif text-2xl text-vetiver md:text-3xl">Thank you.</h2>
              <p className="text-foreground/75">Your diagnostic request has been received. Our team will be in touch within 48 hours.</p>
              <div className="mt-6">
                <Link to="/contact" search={{ service: "Finance Readiness Pack" } as never} className="inline-flex items-center gap-1.5 rounded-lg bg-ochre px-5 py-2.5 text-sm font-semibold text-ink shadow-sm hover:opacity-95">
                  Request Full Finance Readiness Pack <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-5 rounded-2xl border border-border bg-white p-8 shadow-sm">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-ochre">Diagnostic form</p>
                <h2 className="font-serif text-2xl text-vetiver">Tell us about your business</h2>
              </div>
              <Row><Field name="full_name" label="Full name" required /><Field name="email" type="email" label="Email" required /></Row>
              <Row><Field name="phone" label="Phone (WhatsApp)" /><Field name="business_name" label="Business name" required /></Row>
              <Row><Field name="business_sector" label="Business sector" placeholder="e.g. Agro-processing" /><Field name="location" label="Location (city/state)" /></Row>
              <Row>
                <Select name="years_in_operation" label="Years in operation" options={["< 1 year","1-2 years","3-5 years","6-10 years","10+ years"]} />
                <Select name="registration_status" label="Registration status" options={["Not registered","Business Name","Limited Liability","Cooperative","Other"]} />
              </Row>
              <Row>
                <Select name="monthly_sales_estimate" label="Monthly sales estimate" options={["< ₦100k","₦100k - ₦500k","₦500k - ₦2m","₦2m - ₦10m","₦10m+"]} />
                <Select name="funding_type_needed" label="Funding type needed" options={["Loan","Grant","Equity / Investment","Working capital","Asset finance","Not sure"]} />
              </Row>
              <Field name="funding_amount_needed" label="Approximate funding amount needed" placeholder="e.g. ₦2,000,000" />
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground/80">Main funding challenge</label>
                <textarea name="main_funding_challenge" rows={4} className="input" placeholder="What's the biggest obstacle to securing the funding you need?" />
              </div>
              {err && <p className="text-sm text-destructive">{err}</p>}
              <button disabled={state === "loading"} className="rounded-lg bg-vetiver px-6 py-3 font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60">
                {state === "loading" ? "Submitting…" : "Submit Diagnostic Request"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

function Row({ children }: { children: React.ReactNode }) { return <div className="grid gap-5 md:grid-cols-2">{children}</div>; }
function Field({ name, label, type = "text", required, placeholder }: { name: string; label: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground/80">{label}{required && " *"}</label>
      <input name={name} type={type} required={required} placeholder={placeholder} className="input" />
    </div>
  );
}
function Select({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground/80">{label}</label>
      <select name={name} className="input">
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
