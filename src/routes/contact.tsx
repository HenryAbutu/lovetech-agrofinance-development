import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, CheckCircle2 } from "lucide-react";
import { submitEnquiry } from "@/lib/forms.functions";

type ContactSearch = { service?: string };

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Book a Consultation — LoveTech Agrofinance & Development" },
      { name: "description", content: "Request consulting support for your business — finance readiness, documentation, digital systems, AI, training and programme implementation." },
      { property: "og:title", content: "Book a Consultation — LoveTech" },
      { property: "og:description", content: "Talk to our team about the practical support your business needs." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): ContactSearch => ({
    service: typeof search.service === "string" ? search.service : undefined,
  }),
  component: ContactPage,
});

const serviceAreas = [
  "Business Structure & Documentation",
  "Finance Readiness",
  "Grant or Loan Application Support",
  "Digital Business Systems",
  "AI & Productivity Consulting",
  "Training & Capacity Building",
  "Programme Design & Implementation",
  "Other",
];

function ContactPage() {
  const { service } = Route.useSearch();
  const submit = useServerFn(submitEnquiry);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("loading"); setErr("");
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    // Map service_area to service_interest for backward compat
    if (data.service_area && !data.service_interest) data.service_interest = data.service_area;
    try {
      await submit({ data: data as never });
      setState("done"); form.reset();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Failed to send"); setState("error");
    }
  }

  return (
    <main className="bg-white">
      <section className="border-b border-border bg-gradient-to-br from-[#FFF8E7] via-white to-white px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ochre">Book a Consultation</p>
          <h1 className="font-serif text-4xl text-vetiver md:text-6xl">Let's talk about your business.</h1>
          <p className="mt-6 max-w-2xl text-lg text-foreground/70">Request consulting support — finance readiness, documentation, digital systems, AI, training or programme implementation. We respond within 48 hours.</p>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[2fr_1fr]">
          {state === "done" ? (
            <div className="rounded-2xl border border-vetiver/25 bg-vetiver/5 p-10 shadow-sm">
              <div className="mb-4 grid size-12 place-items-center rounded-full bg-vetiver/10 text-vetiver">
                <CheckCircle2 className="size-6" />
              </div>
              <h2 className="mb-3 font-serif text-2xl text-vetiver md:text-3xl">Thank you for contacting LoveTech.</h2>
              <p className="text-foreground/75">Your request has been received and our team will review it and respond within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-5 rounded-2xl border border-border bg-white p-8 shadow-sm">
              <div className="grid gap-5 md:grid-cols-2">
                <Field name="full_name" label="Full name" required />
                <Field name="email" type="email" label="Email" required />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field name="phone" label="Phone / WhatsApp" />
                <Field name="business_name" label="Business / organisation" />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground/80">Service area</label>
                  <select name="service_area" defaultValue={service ?? ""} className="input">
                    <option value="">Select…</option>
                    {serviceAreas.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <Field name="support_needed" label="Type of support needed" placeholder="e.g. Business plan, grant application" />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground/80">Urgency</label>
                  <select name="urgency" className="input">
                    <option value="">Select…</option>
                    {["Just exploring","Within 1 month","Within 2 weeks","This week"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground/80">Budget range (optional)</label>
                  <select name="budget_range" className="input">
                    <option value="">Select…</option>
                    {["Under ₦100k","₦100k - ₦500k","₦500k - ₦2m","₦2m+","Not sure yet"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground/80">Message *</label>
                <textarea name="message" required rows={5} className="input" placeholder="Tell us about your business and what you need help with." />
              </div>
              {err && <p className="text-sm text-destructive">{err}</p>}
              <button disabled={state === "loading"} className="rounded-lg bg-vetiver px-6 py-3 font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60">{state === "loading" ? "Sending…" : "Send Consultation Request"}</button>
            </form>
          )}

          <aside className="rounded-2xl bg-vetiver p-8 text-white shadow-sm">
            <h3 className="mb-6 font-serif text-2xl text-white">Reach us directly</h3>
            <ul className="space-y-5 text-sm">
              <li className="flex gap-3"><Phone className="mt-0.5 size-4 text-ochre" /><span>+234 802 606 5189</span></li>
              <li className="flex gap-3"><MessageCircle className="mt-0.5 size-4 text-ochre" /><a className="hover:text-ochre" href="https://wa.me/2348026065189">WhatsApp us</a></li>
              <li className="flex gap-3"><Mail className="mt-0.5 size-4 text-ochre" /><span>info@lovetechgroup.com.ng</span></li>
              <li className="flex gap-3"><MapPin className="mt-0.5 size-4 text-ochre" /><span>27, 3rd Avenue, Aldenco Estate, Galadimawa, Abuja, Nigeria</span></li>
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Field({ name, label, type = "text", required, placeholder }: { name: string; label: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground/80">{label}{required && " *"}</label>
      <input name={name} type={type} required={required} placeholder={placeholder} className="input" />
    </div>
  );
}
