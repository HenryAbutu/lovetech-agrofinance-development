import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-lovetech.jpg";
import academyImg from "@/assets/academy.jpg";
import diagnosticImg from "@/assets/diagnostic.jpg";
import { ArrowRight, Sparkles, TrendingUp, GraduationCap, Cpu, Sprout, ClipboardCheck, Users } from "lucide-react";
import { FloatingLeaves, GrowthChart, OrbitingNodes, SproutMark } from "@/components/motion-graphics";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LoveTech Agrofinance & Development Ltd — Capital, Capacity & Code for Nigerian MSMEs" },
      { name: "description", content: "Capital, capacity, and tech-enabled advisory for agribusinesses, MSMEs, and development programmes across Nigeria and West Africa." },
      { property: "og:title", content: "LoveTech Agrofinance & Development Ltd" },
      { property: "og:description", content: "Capital, capacity, and tech-enabled advisory for agribusinesses, MSMEs, and development programmes across Nigeria and West Africa." },
    ],
  }),
  component: Home,
});

const services = [
  { icon: TrendingUp, title: "Capital", body: "Loan and grant readiness, business plans, financial modelling, pitch decks, and direct linkages to markets and capital matched to your stage and sector." },
  { icon: ClipboardCheck, title: "Capacity", body: "MSME training and academy programmes, business development services, cooperative strengthening, governance advisory, and climate-smart enterprise support." },
  { icon: Sprout, title: "Code", body: "M&E and impact assessment, research and ecosystem mapping, data dashboards, pipeline tools, and evidence-based policy support." },
  { icon: GraduationCap, title: "Training & Academy", body: "Practical courses via LoveTech Agro Academy — entrepreneurship, AI, finance, digital tools — for individuals, teams and partner organisations." },
  { icon: Cpu, title: "Digital & AI Support", body: "Apply AI, automation, data and digital tools to marketing, sales, operations and profitability. We translate the hype into real workflows." },
  { icon: Users, title: "Consulting & Implementation", body: "Programme design, diagnostics, enterprise-support systems, monitoring, MSME projects and partner-organisation support." },
];

const approach = [
  { n: "01", t: "Diagnose", b: "Understand the business, gaps, records, needs, and growth barriers." },
  { n: "02", t: "Design", b: "Create practical tools, training, advisory support, and action plans." },
  { n: "03", t: "Build Capacity", b: "Train entrepreneurs, teams, and partner organisations." },
  { n: "04", t: "Support Implementation", b: "Help businesses apply tools, improve systems, and prepare for opportunities." },
  { n: "05", t: "Track Growth", b: "Review outcomes, readiness, productivity, market access and finance progress." },
];

function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-16 pb-20 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-vetiver/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-vetiver">
                <Sparkles className="size-3.5" /> Agrofinance · Enterprise Development · Access to Finance · Climate Finance
              </div>
              <h1 className="text-balance font-serif text-5xl leading-[1.05] text-vetiver md:text-6xl lg:text-7xl">
                Capital, capacity, and a sharper way to get businesses funded.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-foreground/75">
                LoveTech Agrofinance & Development Ltd supports agribusinesses, MSMEs, cooperatives, women- and youth-led enterprises, institutions, and development programmes to become finance-ready, investment-ready, and growth-ready.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/contact" className="rounded-sm bg-vetiver px-7 py-3 text-base font-semibold text-bone shadow-sm transition-opacity hover:opacity-95">
                  Book a Consultation
                </Link>
                <Link to="/academy" className="inline-flex items-center gap-2 rounded-sm border border-vetiver/20 bg-transparent px-7 py-3 text-base font-semibold text-vetiver transition-colors hover:bg-vetiver/5">
                  Explore the Academy <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium uppercase tracking-wider text-foreground/60">
                <span>· Business Development</span>
                <span>· Finance Readiness</span>
                <span>· MSME Training</span>
                <span>· AI & Digital Tools</span>
                <span>· Agroenterprise</span>
              </div>
            </div>
            <div className="relative">
              <img src={heroImg} alt="Nigerian business owner reviewing finances and agribusiness samples" width={1600} height={1200} className="aspect-[4/5] w-full rounded-2xl object-cover ring-1 ring-black/5" />
              <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-border bg-card p-5 shadow-xl sm:block">
                <div className="font-serif text-3xl text-vetiver">From hustle</div>
                <div className="font-serif text-3xl italic text-ochre">to structure.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="border-y border-border bg-card py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ochre">What we do</p>
            <h2 className="text-balance font-serif text-4xl text-vetiver md:text-5xl">Practical support for growing businesses</h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl bg-border md:grid-cols-2 lg:grid-cols-3">
            {services.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-card p-8 transition-colors hover:bg-muted/40">
                <div className="mb-5 grid size-11 place-items-center rounded-sm bg-vetiver/5 text-vetiver">
                  <Icon className="size-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-foreground/70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SOLUTIONS */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              eyebrow="Diagnostic"
              title="Know how ready your business is for funding"
              body="A practical tool that assesses your structure, records, compliance, cashflow, funding purpose, repayment logic and readiness gaps."
              cta="Start Diagnostic"
              to="/finance-readiness"
              image={diagnosticImg}
              tint="teal"
            />
            <FeatureCard
              eyebrow="Agro Academy"
              title="Learn practical skills for business growth"
              body="Hands-on courses in AI for business, entrepreneurship, finance readiness, digital tools and growth systems."
              cta="Visit Academy"
              to="/academy"
              image={academyImg}
              tint="academy"
            />
            <FeatureCard
              eyebrow="Consulting"
              title="Get guided support to structure your business"
              body="Advisory for business planning, documentation, finance readiness, operations and growth strategy."
              cta="Book a Consultation"
              to="/contact"
              image={heroImg}
              tint="vetiver"
            />
          </div>
        </div>
      </section>

      {/* ACADEMY PREVIEW */}
      <section className="relative bg-ink py-24 text-bone">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--academy)" }}>LoveTech Agro Academy</p>
              <h2 className="text-balance font-serif text-4xl text-bone md:text-5xl">Practical training for entrepreneurs and value chain actors</h2>
            </div>
            <Link to="/academy" className="inline-flex items-center gap-2 text-sm font-semibold text-ochre hover:gap-3 transition-all">
              Go to Academy <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <CourseCard
              status="Enrolment Open"
              title="Professionals AI Edge"
              body="Practical AI tools for more efficient, productive and profitable businesses."
              priceRegular="₦10,000"
              priceLaunch="₦1,000"
              to="/academy/courses/professionals-ai-edge"
              cta="Enroll Now"
              featured
            />
            <CourseCard
              status="Coming Soon"
              title="ICSS 2.0 Entrepreneurship Programme"
              body="Practical entrepreneurship training for MSME growth, finance readiness and market access."
              to="/academy/courses/icss-2-0-entrepreneurship"
              cta="Join Waitlist"
            />
            <CourseCard
              status="Coming Soon"
              title="Finance Readiness for MSMEs"
              body="Learn how to prepare your business for loans, grants, investments and partnership funding."
              to="/academy/courses/finance-readiness-msmes"
              cta="Join Waitlist"
            />
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ochre">Our approach</p>
            <h2 className="font-serif text-4xl text-vetiver md:text-5xl">From diagnosis to implementation</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-5">
            {approach.map((s) => (
              <div key={s.n} className="rounded-lg border border-border bg-card p-6">
                <div className="mb-3 font-mono text-xs font-semibold text-ochre">{s.n}</div>
                <h4 className="mb-2 font-serif text-2xl text-vetiver">{s.t}</h4>
                <p className="text-xs leading-relaxed text-foreground/65">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-vetiver p-10 text-bone md:p-16">
          <div className="grid items-center gap-8 md:grid-cols-[2fr_1fr]">
            <div>
              <h2 className="mb-4 text-balance font-serif text-4xl md:text-5xl">Ready to build a more structured and growth-ready business?</h2>
              <p className="max-w-xl text-bone/75">Book a consultation, start your finance readiness diagnostic, or join the Academy.</p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Link to="/contact" className="rounded-sm bg-ochre px-6 py-3 text-center font-semibold text-white">Book a Consultation</Link>
              <Link to="/finance-readiness" className="rounded-sm border border-bone/30 px-6 py-3 text-center font-semibold text-bone hover:bg-bone/10">Start Diagnostic</Link>
              <Link to="/academy" className="text-center text-sm text-bone/80 hover:text-ochre">Explore the Academy →</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ eyebrow, title, body, cta, to, image, tint }: { eyebrow: string; title: string; body: string; cta: string; to: string; image: string; tint: "teal" | "academy" | "vetiver" }) {
  const tintColor = tint === "teal" ? "var(--teal)" : tint === "academy" ? "var(--academy)" : "var(--vetiver)";
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card">
      <img src={image} alt="" width={800} height={500} loading="lazy" className="aspect-[5/3] w-full object-cover" />
      <div className="p-6">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: tintColor }}>{eyebrow}</p>
        <h3 className="mb-3 font-serif text-2xl leading-tight text-vetiver">{title}</h3>
        <p className="mb-5 text-sm leading-relaxed text-foreground/65">{body}</p>
        <Link to={to} className="inline-flex items-center gap-2 text-sm font-semibold text-vetiver group-hover:gap-3 transition-all">
          {cta} <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}

function CourseCard({ status, title, body, priceRegular, priceLaunch, to, cta, featured }: { status: string; title: string; body: string; priceRegular?: string; priceLaunch?: string; to: string; cta: string; featured?: boolean }) {
  return (
    <article className={`flex flex-col rounded-2xl border p-6 ${featured ? "border-transparent bg-bone/5 ring-1" : "border-white/10 bg-white/5 opacity-90"}`} style={featured ? { boxShadow: "inset 0 0 0 1px var(--academy)" } : undefined}>
      <span className="mb-4 inline-flex w-fit rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider" style={featured ? { backgroundColor: "color-mix(in oklab, var(--academy) 20%, transparent)", color: "var(--bone)" } : undefined}>
        {status}
      </span>
      <h3 className="mb-2 font-serif text-2xl">{title}</h3>
      <p className="mb-6 flex-1 text-sm text-bone/65">{body}</p>
      {priceRegular && (
        <div className="mb-6 flex items-baseline gap-2">
          <span className="text-sm text-bone/40 line-through">{priceRegular}</span>
          <span className="text-2xl font-bold text-ochre">{priceLaunch}</span>
        </div>
      )}
      <Link to={to} className={`rounded-sm py-2.5 text-center text-sm font-semibold ${featured ? "text-white" : "border border-bone/20 text-bone hover:bg-bone/10"}`} style={featured ? { backgroundColor: "var(--academy)" } : undefined}>
        {cta}
      </Link>
    </article>
  );
}
