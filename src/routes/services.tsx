import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — LoveTech Agrofinance & Development" },
      { name: "description", content: "Business development, finance readiness, agrofinance, training, consulting and digital/AI support for MSMEs." },
      { property: "og:title", content: "Our Services" },
      { property: "og:description", content: "Practical advisory, training and implementation for Nigerian enterprises." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { t: "Business Development", b: "Business structuring, strategy, operations, market access, growth planning. Designed for owner-operators ready to scale beyond informal trading.", cta: "Book a Consultation", to: "/contact" },
  { t: "Finance Readiness", b: "Diagnostics, documentation, cashflow review, loan- and grant-readiness preparation. We get your business ready before you walk into the bank.", cta: "Start Diagnostic", to: "/finance-readiness" },
  { t: "Agrofinance & Value Chain", b: "Support for agribusinesses, cooperatives and value chain actors to become investment-ready and access agrofinance and grants.", cta: "Talk to Us", to: "/contact" },
  { t: "Training & Capacity", b: "Practical training via LoveTech Agro Academy — entrepreneurship, AI, finance, digital tools — for individuals, teams and partner organisations.", cta: "Visit Academy", to: "/academy" },
  { t: "Digital & AI Support", b: "Apply AI, automation, data and digital tools to marketing, sales, operations and profitability. We translate the hype into real workflows.", cta: "Get AI Edge", to: "/academy/courses/professionals-ai-edge" },
  { t: "Consulting & Implementation", b: "Programme design, diagnostics, enterprise-support systems, monitoring, MSME projects and partner-organisation support.", cta: "Engage Us", to: "/contact" },
];

function ServicesPage() {
  return (
    <main>
      <section className="border-b border-border bg-card px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ochre">Services</p>
          <h1 className="font-serif text-5xl text-vetiver md:text-6xl">Practical support across the MSME growth journey.</h1>
          <p className="mt-6 max-w-3xl text-lg text-foreground/70">From diagnosis to capacity building to implementation — we work with entrepreneurs, agribusinesses and partner organisations.</p>
        </div>
      </section>
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          {services.map((s, i) => (
            <article key={s.t} className="rounded-2xl border border-border bg-card p-8">
              <div className="mb-3 font-mono text-xs text-ochre">0{i + 1}</div>
              <h3 className="mb-3 font-serif text-3xl text-vetiver">{s.t}</h3>
              <p className="mb-6 text-foreground/70">{s.b}</p>
              <Link to={s.to} className="inline-flex rounded-sm bg-vetiver px-5 py-2.5 text-sm font-semibold text-bone hover:opacity-95">{s.cta}</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
