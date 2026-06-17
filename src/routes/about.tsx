import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — LoveTech Agrofinance & Development" },
      { name: "description", content: "Mission, vision, values and focus areas of LoveTech Agrofinance & Development." },
      { property: "og:title", content: "About LoveTech Agrofinance & Development" },
      { property: "og:description", content: "Helping Nigerian MSMEs move from hustle to structure." },
    ],
  }),
  component: AboutPage,
});

const diffs = [
  { t: "Tech-enabled, not tech-obsessed", b: "We use digital tools to do better work, not to replace expertise. Clients get faster turnaround, sharper data, and more transparent reporting." },
  { t: "Capital, capacity, and code", b: "Capital alone doesn't move a business forward. Neither does capacity, nor data on its own. We're built to deliver financing solutions, institutional strengthening, and digital tools under one roof." },
  { t: "Locally rooted, globally legible", b: "Our case studies and operating instincts are unmistakably grounded in Nigerian and West African realities. Our standards, frameworks, and reporting discipline meet donor and financier expectations." },
  { t: "Inclusion as a method", b: "Women-led businesses, youth enterprises, and underserved communities are central to how we structure programmes, not an afterthought." },
];

const focus = [
  "Agrofinance & enterprise development",
  "MSME training & academy programmes",
  "Finance & investment readiness",
  "Cooperative & farmer-group strengthening",
  "Climate-smart enterprise advisory",
  "M&E, research & ecosystem mapping",
  "Digital, data & AI for business",
  "Programme design & implementation",
];

function AboutPage() {
  return (
    <main>
      <section className="border-b border-border bg-card px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ochre">About</p>
          <h1 className="font-serif text-5xl text-vetiver md:text-6xl">A development-focused firm for Nigerian enterprises.</h1>
          <p className="mt-6 max-w-3xl text-lg text-foreground/70">
            LoveTech Agrofinance & Development Ltd is a tech-enabled advisory firm working at the intersection of agriculture, climate finance, and enterprise development across Nigeria and the wider West African region. We support agribusinesses, MSMEs, cooperatives, women- and youth-led enterprises, institutions, and development programmes to become finance-ready, investment-ready, and growth-ready.
          </p>
          <p className="mt-4 max-w-3xl text-sm text-foreground/60">
            RC: 9535107 · TIN: 2623772591480
          </p>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-8">
            <h2 className="mb-3 font-serif text-3xl text-vetiver">Our Mission</h2>
            <p className="text-foreground/75">To empower Nigerian MSMEs, agribusinesses and professionals with the practical knowledge, structure and finance-readiness they need to grow sustainably and access the capital that moves real money into real businesses.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8">
            <h2 className="mb-3 font-serif text-3xl text-vetiver">Our Vision</h2>
            <p className="text-foreground/75">A Nigeria where every entrepreneur — from informal traders to formal SMEs — has access to the tools, training and finance pathways that move them from hustle to structure, with women, youth and rural enterprises at the centre.</p>
          </div>
        </div>
      </section>

      <section className="bg-ink px-6 py-20 text-bone lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ochre">What makes us different</p>
          <h2 className="mb-12 font-serif text-4xl md:text-5xl">Built differently, on purpose</h2>
          <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-2">
            {diffs.map((v) => (
              <div key={v.t} className="bg-ink p-6">
                <h3 className="mb-2 font-serif text-xl text-ochre">{v.t}</h3>
                <p className="text-sm text-bone/65">{v.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ochre">Focus Areas</p>
          <h2 className="mb-10 font-serif text-4xl text-vetiver md:text-5xl">Where we work</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {focus.map((f) => (
              <li key={f} className="flex gap-3 rounded-lg border border-border bg-card p-5">
                <span className="mt-1 size-2 rounded-full bg-ochre" />
                <span className="text-foreground/80">{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Link to="/contact" className="inline-flex rounded-sm bg-vetiver px-6 py-3 font-semibold text-bone">Work with us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
