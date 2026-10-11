import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, CheckCircle2, Clock, GraduationCap, BedDouble, Leaf, Building2, ArrowRight } from "lucide-react";
import { submitEnquiry } from "@/lib/forms.functions";
import { Button } from "@/components/ui/button";
import { LegalNotice } from "@/components/legal-notice";

type ContactSearch = { service?: string; business?: string };

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Lovetech — Business & Institutional Advisory" },
      { name: "description", content: "Discuss advisory, finance readiness, digital solutions, practical training and programme support with Lovetech." },
      { property: "og:title", content: "Contact Lovetech" },
      { property: "og:description", content: "Start a conversation with Lovetech about your business, team or programme." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): ContactSearch => ({
    service: typeof search.service === "string" ? search.service : undefined,
    business: typeof search.business === "string" ? search.business : undefined,
  }),
  component: ContactPage,
});

const businesses = [
  { id: "Advisory & Academy", icon: Building2, blurb: "Finance readiness, business structure, digital systems, training and programmes.", to: "/advisory" as const },
  { id: "LoveTech Agro Academy", icon: GraduationCap, blurb: "Courses, cohorts, corporate training and learner support.", to: "/academy" as const },
  { id: "House 8 Shortlet Apartments", icon: BedDouble, blurb: "Stays, long-stay rates and corporate accommodation in Abuja.", to: "/house-8" as const },
  { id: "Ruby Chai Wellness", icon: Leaf, blurb: "Tea orders, gifting packs and wholesale supply.", to: "/ruby-chai" as const },
];

const serviceAreas = [
  "Business Structure & Documentation",
  "Finance Readiness",
  "Grant or Loan Application Support",
  "Digital Business Systems",
  "AI & Productivity Consulting",
  "Training & Capacity Building",
  "Programme Design & Implementation",
  "Partnership or Investment",
  "Other",
];

function ContactPage() {
  const { service, business } = Route.useSearch();
  const submit = useServerFn(submitEnquiry);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const [unit, setUnit] = useState<string>(business && businesses.some((b) => b.id === business) ? business : businesses[0]!.id);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("loading"); setErr("");
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    data.service_interest = `${unit}${data.service_area ? ` — ${data.service_area}` : ""}`;
    try {
      await submit({ data: data as never });
      setState("done"); form.reset();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Failed to send"); setState("error");
    }
  }

  return (
    <main className="website">
      <section className="border-b border-border bg-secondary px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-teal">Contact Lovetech</p>
          <h1 className="font-serif text-4xl font-bold text-navy md:text-6xl">Let’s start with what you need.</h1>
          <p className="mt-6 max-w-2xl text-lg text-foreground/70">
            Tell us about your business, team or programme. We’ll help you find the right starting point.
          </p>

        </div>
      </section>

      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-2xl font-bold text-navy md:text-3xl">Who would you like to reach?</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {businesses.map((b) => {
              const active = unit === b.id;
              return (
                <article key={b.id} className={`web-form-selection rounded-lg border p-5 text-left transition-all ${active ? "border-teal bg-teal/5 shadow-sm" : "border-border bg-background hover:border-teal/40"}`}>
                  <Button variant="ghost" type="button" onClick={() => setUnit(b.id)} aria-pressed={active} className="block h-auto w-full whitespace-normal p-0 text-left hover:bg-transparent">
                  <b.icon className={`size-6 ${active ? "text-teal" : "text-navy/60"}`} />
                  <h3 className="mt-3 text-sm font-semibold text-navy">{b.id}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-foreground/65">{b.blurb}</p>
                  </Button>
                  <Link to={b.to} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-teal hover:underline">
                    Visit page <ArrowRight className="size-3" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-cloud px-6 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[2fr_1fr]">
          {state === "done" ? (
            <div className="rounded-lg border border-teal/25 bg-background p-10 shadow-sm">
              <div className="mb-4 grid size-12 place-items-center rounded-full bg-teal/10 text-teal">
                <CheckCircle2 className="size-6" />
              </div>
              <h2 className="mb-3 font-serif text-2xl font-bold text-navy md:text-3xl">Thank you for contacting LoveTech Group.</h2>
              <p className="text-foreground/75">Your request has been received. The relevant team will review it and respond within 48 hours.</p>
              <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal">Back to home <ArrowRight className="size-4" /></Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-5 rounded-lg border border-border bg-background p-8 shadow-sm">
              <p className="text-sm text-foreground/70">
                Enquiry for <span className="font-semibold text-navy">{unit}</span>
              </p>
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
                  <label htmlFor="service_area" className="mb-1 block text-sm font-medium text-foreground/80">Area of interest</label>
                  <select id="service_area" name="service_area" defaultValue={service ?? ""} className="input">
                    <option value="">Select…</option>
                    {serviceAreas.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <Field name="support_needed" label="Type of support needed" placeholder="e.g. Business plan, grant application, stay dates" />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="urgency" className="mb-1 block text-sm font-medium text-foreground/80">Urgency</label>
                  <select id="urgency" name="urgency" className="input">
                    <option value="">Select…</option>
                    {["Just exploring","Within 1 month","Within 2 weeks","This week"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="budget_range" className="mb-1 block text-sm font-medium text-foreground/80">Budget range (optional)</label>
                  <select id="budget_range" name="budget_range" className="input">
                    <option value="">Select…</option>
                    {["Under ₦100k","₦100k - ₦500k","₦500k - ₦2m","₦2m+","Not sure yet"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="message" className="mb-1 block text-sm font-medium text-foreground/80">Message *</label>
                <textarea id="message" name="message" required rows={5} className="input" placeholder="Tell us about your business, stay or order and what you need help with." />
              </div>
              {err && <p className="text-sm text-destructive">{err}</p>}
              <Button disabled={state === "loading"} className="rounded-lg bg-navy px-6 py-3 font-semibold text-primary-foreground shadow-sm hover:opacity-95 disabled:opacity-60">
                {state === "loading" ? "Sending…" : "Send enquiry"}
               </Button>
              <LegalNotice action="submitting this enquiry" />
              <p className="text-xs text-foreground/60">
                Booking a stay? You can also use the <Link to="/house-8" className="font-semibold text-teal hover:underline">House 8 booking form</Link>. Ordering tea? Use the <Link to="/ruby-chai" className="font-semibold text-teal hover:underline">Ruby Chai shop</Link>.
              </p>
            </form>
          )}

          <aside className="rounded-lg bg-navy p-8 text-primary-foreground shadow-sm">
            <h3 className="mb-6 font-serif text-2xl font-bold text-primary-foreground">Reach us directly</h3>
            <ul className="space-y-5 text-sm">
              <li className="flex gap-3"><Phone className="mt-0.5 size-4 shrink-0 text-gold" /><a className="hover:text-gold" href="tel:+2348026065189">+234 802 606 5189</a></li>
              <li className="flex gap-3"><MessageCircle className="mt-0.5 size-4 shrink-0 text-gold" /><a className="hover:text-gold" href="https://wa.me/2348026065189" target="_blank" rel="noreferrer">WhatsApp us</a></li>
              <li className="flex gap-3"><Mail className="mt-0.5 size-4 shrink-0 text-gold" /><a className="hover:text-gold" href="mailto:info@lovetechgroup.com.ng">info@lovetechgroup.com.ng</a></li>
              <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-gold" /><span>27, 3rd Avenue, Aldenco Estate, Galadimawa, Abuja, Nigeria</span></li>
            </ul>
            <div className="mt-8 border-t border-primary-foreground/15 pt-6 text-sm text-primary-foreground/75">
              <p className="font-semibold text-primary-foreground">Group businesses</p>
              <ul className="mt-3 space-y-2">
                <li><Link to="/advisory" className="hover:text-gold">LoveTech Advisory & Academy</Link></li>
                <li><Link to="/house-8" className="hover:text-gold">House 8 Shortlet Apartments</Link></li>
                <li><Link to="/ruby-chai" className="hover:text-gold">Ruby Chai Wellness</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Field({ name, label, type = "text", required, placeholder }: { name: string; label: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-foreground/80">{label}{required && " *"}</label>
      <input id={name} name={name} type={type} required={required} placeholder={placeholder} className="input" />
    </div>
  );
}
