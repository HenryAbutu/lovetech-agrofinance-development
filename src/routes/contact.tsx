import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { submitEnquiry } from "@/lib/forms.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — LoveTech Agrofinance & Development" },
      { name: "description", content: "Get in touch to book a consultation or talk to our team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const submit = useServerFn(submitEnquiry);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading"); setErr("");
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    try {
      await submit({ data: data as never });
      setState("done"); e.currentTarget.reset();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Failed to send"); setState("error");
    }
  }

  return (
    <main>
      <section className="border-b border-border bg-card px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ochre">Contact</p>
          <h1 className="font-serif text-5xl text-vetiver md:text-6xl">Let's talk about your business.</h1>
          <p className="mt-6 max-w-2xl text-lg text-foreground/70">Book a consultation, ask about our programmes, or partner with us on enterprise development.</p>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[2fr_1fr]">
          {state === "done" ? (
            <div className="rounded-2xl border border-vetiver/30 bg-vetiver/5 p-10">
              <h2 className="mb-3 font-serif text-3xl text-vetiver">Message received.</h2>
              <p className="text-foreground/75">Our team will respond within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-5 rounded-2xl border border-border bg-card p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <Field name="full_name" label="Full name" required />
                <Field name="email" type="email" label="Email" required />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field name="phone" label="Phone (WhatsApp)" />
                <Field name="business_name" label="Business / organisation" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground/80">Service interest</label>
                <select name="service_interest" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                  <option value="">Select…</option>
                  {["Business Development","Finance Readiness","Agrofinance & Value Chain","Training & Capacity","Digital & AI","Consulting","Other"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground/80">Message *</label>
                <textarea name="message" required rows={5} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
              </div>
              {err && <p className="text-sm text-destructive">{err}</p>}
              <button disabled={state === "loading"} className="rounded-sm bg-vetiver px-6 py-3 font-semibold text-bone disabled:opacity-60">{state === "loading" ? "Sending…" : "Send Message"}</button>
            </form>
          )}

          <aside className="rounded-2xl bg-vetiver p-8 text-bone">
            <h3 className="mb-6 font-serif text-2xl text-bone">Reach us directly</h3>
            <ul className="space-y-5 text-sm">
              <li className="flex gap-3"><Phone className="mt-0.5 size-4 text-ochre" /><span>+234 802 606 5189</span></li>
              <li className="flex gap-3"><MessageCircle className="mt-0.5 size-4 text-ochre" /><a className="hover:text-ochre" href="https://wa.me/2348026065189">WhatsApp us</a></li>
              <li className="flex gap-3"><Mail className="mt-0.5 size-4 text-ochre" /><span>info@lovetechagro.com</span></li>
              <li className="flex gap-3"><MapPin className="mt-0.5 size-4 text-ochre" /><span>Abuja, Nigeria</span></li>
            </ul>
          </aside>
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
