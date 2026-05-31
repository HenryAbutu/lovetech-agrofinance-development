import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { submitDiagnostic } from "@/lib/forms.functions";

export const Route = createFileRoute("/finance-readiness")({
  head: () => ({
    meta: [
      { title: "Finance Readiness Diagnostic — LoveTech" },
      { name: "description", content: "Free diagnostic to assess your business's readiness for loans, grants and investment." },
    ],
  }),
  component: DiagnosticPage,
});

function DiagnosticPage() {
  const submit = useServerFn(submitDiagnostic);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading"); setErr("");
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    try {
      await submit({ data: data as never });
      setState("done");
      e.currentTarget.reset();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Failed to submit");
      setState("error");
    }
  }

  return (
    <main>
      <section className="border-b border-border bg-card px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ochre">Diagnostic</p>
          <h1 className="font-serif text-5xl text-vetiver md:text-6xl">Finance Readiness Diagnostic</h1>
          <p className="mt-5 max-w-2xl text-lg text-foreground/70">
            A practical assessment of how ready your business is for a loan, grant, or investment. Tell us about your business and we'll come back with your readiness summary.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {state === "done" ? (
            <div className="rounded-2xl border border-vetiver/30 bg-vetiver/5 p-8 text-center">
              <h2 className="mb-3 font-serif text-3xl text-vetiver">Thank you.</h2>
              <p className="text-foreground/75">Your diagnostic request has been received. Our team will be in touch within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-5 rounded-2xl border border-border bg-card p-8">
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
                <textarea name="main_funding_challenge" rows={4} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="What's the biggest obstacle to securing the funding you need?" />
              </div>
              {err && <p className="text-sm text-destructive">{err}</p>}
              <button disabled={state === "loading"} className="rounded-sm bg-vetiver px-6 py-3 font-semibold text-bone disabled:opacity-60">
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
      <input name={name} type={type} required={required} placeholder={placeholder} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
    </div>
  );
}
function Select({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground/80">{label}</label>
      <select name={name} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
