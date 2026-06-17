import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — LoveTech Agrofinance & Development Ltd" },
      { name: "description", content: "Capital, capacity, and code — three connected pillars of advisory for agribusinesses, MSMEs, and development programmes." },
      { property: "og:title", content: "Our Services" },
      { property: "og:description", content: "Practical advisory, training and implementation for Nigerian enterprises." },
    ],
  }),
  component: ServicesPage,
});

const pillars = [
  {
    n: "i.",
    t: "Capital",
    subtitle: "Financing solutions that move real money into real businesses.",
    items: [
      "Loan readiness support",
      "Grant readiness & proposal support",
      "Business plans & financial modelling",
      "Pitch deck development",
      "Cooperative finance support",
      "Market & finance linkage facilitation",
    ],
  },
  {
    n: "ii.",
    t: "Capacity",
    subtitle: "Systems, skills, and governance that capital flows through.",
    items: [
      "MSME training & academy programmes",
      "Business development services",
      "Cooperative & farmer-group strengthening",
      "Governance & institutional advisory",
      "Market and ecosystem linkage support",
      "Climate-smart enterprise advisory",
    ],
  },
  {
    n: "iii.",
    t: "Code",
    subtitle: "Research, data, and digital tools — tech-enabled, never tech-obsessed.",
    items: [
      "M&E and impact assessment",
      "Research & ecosystem mapping",
      "Data collection & dashboard reporting",
      "Pipeline & portfolio tracking tools",
      "Evidence-based policy support",
      "Programme implementation support",
    ],
  },
];

const engagements = [
  { t: "Project engagements", b: "Defined scope, fixed fee, clear deliverable. Typical for loan readiness, grant writing, and pitch deck development." },
  { t: "Retainer support", b: "Monthly advisory retainer for institutional clients and cooperatives with a continuous pipeline of finance and capacity needs." },
  { t: "Embedded programme support", b: "Dedicated team members placed inside donor-funded or government MSME programmes for the life of the contract." },
  { t: "Sub-contracts & consortia", b: "We partner with implementing partners, BMOs, and prime consultancies on tendered programmes and larger initiatives." },
];

function ServicesPage() {
  return (
    <main>
      <section className="border-b border-border bg-card px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ochre">Services</p>
          <h1 className="font-serif text-5xl text-vetiver md:text-6xl">Three connected pillars, one engagement.</h1>
          <p className="mt-6 max-w-3xl text-lg text-foreground/70">Most advisory firms make a client choose: hire them for finance, for capacity building, or for data. We're built so clients don't have to. A typical LoveTech engagement draws on all three.</p>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {pillars.map((p) => (
            <article key={p.t} className="rounded-2xl border border-border bg-card p-8">
              <div className="mb-2 font-mono text-xs text-ochre">{p.n}</div>
              <h3 className="mb-2 font-serif text-3xl text-vetiver">{p.t}</h3>
              <p className="mb-6 text-sm text-foreground/60">{p.subtitle}</p>
              <ul className="space-y-2 text-sm text-foreground/75">
                {p.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ochre" />
                    {i}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-ink px-6 py-20 text-bone lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ochre">How to engage us</p>
          <h2 className="mb-12 font-serif text-4xl md:text-5xl">Four ways to work with LoveTech</h2>
          <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-2">
            {engagements.map((e) => (
              <div key={e.t} className="bg-ink p-6">
                <h3 className="mb-2 font-serif text-xl text-ochre">{e.t}</h3>
                <p className="text-sm text-bone/65">{e.b}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/contact" className="inline-flex rounded-sm bg-ochre px-6 py-3 font-semibold text-white">Start a conversation</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
