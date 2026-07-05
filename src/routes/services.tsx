import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, TrendingUp, Laptop, Cpu, GraduationCap, ClipboardList, ArrowRight, MessageSquareText, Search, Lightbulb, Handshake } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — LoveTech Agrofinance & Development Ltd" },
      { name: "description", content: "Practical consulting support for MSMEs, agribusinesses, cooperatives, professionals and development programmes." },
      { property: "og:title", content: "LoveTech Services — Consulting for Nigerian Businesses" },
      { property: "og:description", content: "Business documentation, finance readiness, digital systems, AI, training and programme implementation support." },
    ],
  }),
  component: ServicesPage,
});

type Service = {
  icon: React.ComponentType<{ className?: string }>;
  n: string;
  t: string;
  intro: string;
  items: string[];
  cta: string;
  service: string;
};

const services: Service[] = [
  {
    icon: FileText,
    n: "01",
    t: "Business Structure & Documentation",
    intro: "Give your business the paperwork lenders, partners and customers take seriously.",
    items: [
      "Business profile development",
      "Business plan preparation",
      "Company profile writing",
      "SOPs and operations manuals",
      "Policy documents and templates",
      "Business registration and compliance guidance",
    ],
    cta: "Request this service",
    service: "Business Structure & Documentation",
  },
  {
    icon: TrendingUp,
    n: "02",
    t: "Finance Readiness & Access to Finance",
    intro: "Prepare for loans, grants, investment and partnership funding — with real documentation and numbers.",
    items: [
      "Loan readiness support",
      "Grant readiness support",
      "Pitch deck preparation",
      "Financial projections",
      "Cashflow planning",
      "Funding application support",
      "Investor and lender document packaging",
    ],
    cta: "Start finance support",
    service: "Finance Readiness",
  },
  {
    icon: Laptop,
    n: "03",
    t: "Digital Business Systems",
    intro: "Simple digital tools that give your business structure — without the enterprise-software overhead.",
    items: [
      "Google Forms and data collection setup",
      "Airtable and spreadsheet dashboards",
      "Inventory and sales tracking systems",
      "CRM and customer database setup",
      "WhatsApp Business workflow setup",
      "Simple automation for small businesses",
    ],
    cta: "Build my system",
    service: "Digital Business Systems",
  },
  {
    icon: Cpu,
    n: "04",
    t: "AI & Productivity Consulting",
    intro: "Apply AI to marketing, customer service, administration and decision-making — practically.",
    items: [
      "AI tools setup for business",
      "Prompt systems for teams",
      "AI for marketing and content creation",
      "AI for customer service",
      "AI for documents and administration",
      "AI workflow design for small teams",
    ],
    cta: "Book AI support",
    service: "AI & Productivity Consulting",
  },
  {
    icon: GraduationCap,
    n: "05",
    t: "Training & Capacity Building",
    intro: "Practical training for teams, cohorts, cooperatives and staff — designed to change behaviour, not just tick a box.",
    items: [
      "MSME training design",
      "Entrepreneurship training",
      "Finance readiness training",
      "Agribusiness and value chain training",
      "AI for business training",
      "Staff and team productivity training",
    ],
    cta: "Request training",
    service: "Training & Capacity Building",
  },
  {
    icon: ClipboardList,
    n: "06",
    t: "Programme Design & Implementation Support",
    intro: "For donor-funded, government and BMO-led MSME programmes needing hands-on delivery capacity.",
    items: [
      "MSME project design",
      "Beneficiary onboarding tools",
      "Training curriculum development",
      "M&E tools and reporting templates",
      "Ecosystem mapping",
      "Partner and stakeholder coordination support",
    ],
    cta: "Discuss a project",
    service: "Programme Design & Implementation",
  },
];

const steps = [
  { icon: MessageSquareText, t: "Tell us your need", b: "Share your challenge, business context and what success looks like for you." },
  { icon: Search, t: "We review your business", b: "We assess your business or project against practical benchmarks." },
  { icon: Lightbulb, t: "We recommend a solution", b: "Clear scope, deliverables and timeline — no jargon, no overpromising." },
  { icon: Handshake, t: "We support implementation", b: "We build, train, document and hand over — with follow-up support." },
];

function ServicesPage() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-white px-6 py-20 lg:px-8 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FFF8E7] via-white to-white" />
        <div className="relative mx-auto max-w-5xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ochre">Services</p>
          <h1 className="font-serif text-4xl leading-[1.1] text-vetiver md:text-6xl">
            Practical consulting support for businesses, cooperatives, and development programmes.
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-foreground/70">
            LoveTech provides hands-on advisory, documentation, training, finance readiness, digital systems, and implementation support for Nigerian MSMEs, agribusinesses, cooperatives, professionals, and enterprise development programmes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="rounded-lg bg-vetiver px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95">Book a Consultation</Link>
            <a href="#services" className="rounded-lg border border-vetiver/25 bg-white px-6 py-3 text-sm font-semibold text-vetiver hover:bg-vetiver/5">Browse services</a>
          </div>
        </div>
      </section>

      {/* SERVICE CARDS */}
      <section id="services" className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal">What we do</p>
            <h2 className="font-serif text-3xl text-vetiver md:text-4xl">Six areas of on-demand consulting</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map(({ icon: Icon, ...s }) => (
              <article key={s.t} className="group flex flex-col rounded-2xl border border-border bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:border-vetiver/40 hover:shadow-lg">
                <div className="mb-5 flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-xl bg-vetiver/10 text-vetiver">
                    <Icon className="size-5" />
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-ochre">{s.n}</span>
                </div>
                <h3 className="mb-2 font-serif text-xl text-vetiver">{s.t}</h3>
                <p className="mb-5 text-sm leading-relaxed text-foreground/65">{s.intro}</p>
                <ul className="mb-6 flex-1 space-y-2 text-sm text-foreground/75">
                  {s.items.map((i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  search={{ service: s.service } as never}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-vetiver px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95"
                >
                  {s.cta} <ArrowRight className="size-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW CONSULTING WORKS */}
      <section className="border-y border-border bg-[#FFF8E7] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal">Our process</p>
            <h2 className="font-serif text-3xl text-vetiver md:text-4xl">How Consulting Works</h2>
          </div>
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.t} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="grid size-10 place-items-center rounded-lg bg-teal/10 text-teal">
                    <s.icon className="size-5" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-ochre">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mb-2 font-serif text-lg text-vetiver">{s.t}</h3>
                <p className="text-sm text-foreground/65">{s.b}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <Link to="/contact" className="inline-flex rounded-lg bg-vetiver px-6 py-3 font-semibold text-white shadow-sm hover:opacity-95">Start a conversation</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
