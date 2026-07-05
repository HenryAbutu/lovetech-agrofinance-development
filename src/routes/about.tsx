import { createFileRoute, Link } from "@tanstack/react-router";
import founderImg from "@/assets/founder-avess-abutu.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — LoveTech Agrofinance & Development Ltd" },
      { name: "description", content: "Mission, vision and focus of LoveTech Agrofinance & Development Ltd — RC 9535107." },
      { property: "og:title", content: "About LoveTech Agrofinance & Development Ltd" },
      { property: "og:description", content: "Capital, capacity, and tech-enabled advisory for Nigerian enterprises." },
    ],
  }),
  component: AboutPage,
});

const diffs = [
  { t: "Tech-enabled, not tech-obsessed", b: "We use digital tools to do better work, not to replace expertise. Clients get faster turnaround, sharper data and more transparent reporting." },
  { t: "Capital, capacity, and code", b: "Capital alone doesn't move a business forward. Neither does capacity, nor data on its own. We're built to deliver financing solutions, institutional strengthening, and digital tools under one roof." },
  { t: "Locally rooted, globally legible", b: "Our case studies and operating instincts are grounded in Nigerian and West African realities. Our standards and reporting meet donor and financier expectations." },
  { t: "Inclusion as a method", b: "Women-led businesses, youth enterprises and underserved communities are central to how we structure programmes — not an afterthought." },
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
    <main className="bg-white">
      <section className="border-b border-border bg-gradient-to-br from-[#FFF8E7] via-white to-white px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ochre">About</p>
          <h1 className="font-serif text-4xl text-vetiver md:text-6xl">A development-focused firm for Nigerian enterprises.</h1>
          <p className="mt-6 max-w-3xl text-lg text-foreground/70">
            LoveTech Agrofinance & Development Ltd is a tech-enabled advisory firm working at the intersection of agriculture, climate finance and enterprise development across Nigeria and the wider West African region. We support agribusinesses, MSMEs, cooperatives, women- and youth-led enterprises, institutions and development programmes to become finance-ready, investment-ready and growth-ready.
          </p>
          <p className="mt-4 max-w-3xl text-sm text-foreground/55">RC: 9535107 · TIN: 2623772591480</p>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            <h2 className="mb-3 font-serif text-2xl text-vetiver md:text-3xl">Our Mission</h2>
            <p className="text-foreground/75">To empower Nigerian MSMEs, agribusinesses and professionals with the practical knowledge, structure and finance-readiness they need to grow sustainably and access the capital that moves real money into real businesses.</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            <h2 className="mb-3 font-serif text-2xl text-vetiver md:text-3xl">Our Vision</h2>
            <p className="text-foreground/75">A Nigeria where every entrepreneur — from informal traders to formal SMEs — has access to the tools, training and finance pathways that move them from hustle to structure, with women, youth and rural enterprises at the centre.</p>
          </div>
        </div>
      </section>

      {/* CEO MESSAGE with photo */}
      <section className="border-y border-border bg-[#FFF8E7] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ochre">Message from the Founder / CEO</p>
          <h2 className="mb-12 font-serif text-3xl leading-tight text-vetiver md:text-5xl">Development must be practical.</h2>

          <div className="grid gap-10 lg:grid-cols-[minmax(260px,360px)_1fr] lg:items-start">
            {/* Photo card */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-md">
              <img
                src={founderImg}
                alt="Avess Abutu, Founder and CEO of LoveTech Agrofinance & Development Ltd"
                width={1024}
                height={1280}
                loading="lazy"
                className="aspect-[4/5] w-full rounded-xl object-cover"
              />
              <div className="mt-5 border-t border-border pt-4">
                <p className="font-serif text-xl text-vetiver">Avess Abutu</p>
                <p className="text-sm font-medium text-ochre">Founder / CEO</p>
                <p className="mt-1 text-xs text-foreground/60">LoveTech Agrofinance & Development Ltd</p>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-5 text-[15px] leading-relaxed text-foreground/80">
              <p>At Lovetech Agrofinance & Development, our vision is simple: to help businesses, entrepreneurs, cooperatives and development-focused institutions become more structured, finance-ready and future-ready.</p>
              <p>Across Nigeria and Africa, many businesses have strong ideas, hardworking founders and real market potential. However, they often struggle with structure, access to finance, digital systems, compliance, business planning and the practical tools needed to grow sustainably. LoveTech Agro was created to close that gap.</p>
              <p>We combine business development, agrofinance advisory, training, technology and practical consulting to support small businesses, agribusinesses, SMEs, cooperatives and institutions. Our work is rooted in real business needs: helping entrepreneurs organise operations, prepare for funding, improve records, strengthen market positioning and use digital and AI tools to work smarter.</p>
              <p>Through our consulting services, academy programmes, finance readiness tools and business support solutions, we are building a platform that does more than advise. We equip, guide and walk with our clients from idea to structure, from structure to growth, and from growth to sustainable impact.</p>
              <p>As CEO, I believe that development must be practical. Training must lead to action. Finance must meet readiness. Technology must solve real problems. And every business we support should leave better organised, more confident and more prepared for opportunity.</p>
              <p className="font-serif text-xl italic text-vetiver">— Welcome to LoveTech Agrofinance & Development.</p>
              <div className="pt-2">
                <p className="font-serif text-2xl italic text-vetiver">Avess Abutu</p>
                <p className="text-sm text-foreground/60">Founder / CEO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1F2933] px-6 py-20 text-white/85 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ochre">What makes us different</p>
          <h2 className="mb-12 font-serif text-3xl text-white md:text-5xl">Built differently, on purpose</h2>
          <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-2">
            {diffs.map((v) => (
              <div key={v.t} className="bg-[#1F2933] p-6">
                <h3 className="mb-2 font-serif text-lg text-ochre">{v.t}</h3>
                <p className="text-sm text-white/70">{v.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal">Focus Areas</p>
          <h2 className="mb-10 font-serif text-3xl text-vetiver md:text-5xl">Where we work</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {focus.map((f) => (
              <li key={f} className="flex gap-3 rounded-xl border border-border bg-white p-5 shadow-sm">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-teal" />
                <span className="text-foreground/80">{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Link to="/contact" className="inline-flex rounded-lg bg-vetiver px-6 py-3 font-semibold text-white shadow-sm hover:opacity-95">Work with us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
