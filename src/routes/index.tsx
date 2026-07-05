import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-lovetech.jpg";
import academyImg from "@/assets/academy.jpg";
import diagnosticImg from "@/assets/diagnostic.jpg";
import avessAsset from "@/assets/avess-abutu.png.asset.json";
import { ArrowRight, Sparkles, TrendingUp, GraduationCap, Cpu, Sprout, ClipboardCheck, Users, ShieldCheck } from "lucide-react";
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
        {/* ambient motion backdrop */}
        <FloatingLeaves className="left-[-60px] top-10 size-[420px] opacity-50" />
        <FloatingLeaves className="right-[-80px] bottom-[-40px] size-[360px] opacity-40 rotate-180" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 lt-shimmer" />

        <div className="relative mx-auto max-w-7xl">
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
                <Link to="/signup" search={{ role: "admin" } as never} className="inline-flex items-center gap-2 rounded-sm border border-ochre/40 bg-ochre/10 px-7 py-3 text-base font-semibold text-ochre transition-colors hover:bg-ochre/20">
                  <ShieldCheck className="size-4" /> Admin Sign Up
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
              <img src={heroImg} alt="Nigerian agribusiness entrepreneur reviewing a finance dashboard in a thriving farm" width={1280} height={1600} className="aspect-[4/5] w-full rounded-2xl object-cover ring-1 ring-black/5" />
              {/* animated chart card overlay */}
              <div className="absolute -right-4 top-8 hidden w-56 rounded-xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur sm:block">
                <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-foreground/60">
                  <span>Growth signal</span>
                  <span className="text-ochre">+38%</span>
                </div>
                <GrowthChart className="h-20 w-full text-vetiver" />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden items-center gap-3 rounded-xl border border-border bg-card p-5 shadow-xl sm:flex">
                <SproutMark className="size-10 shrink-0" />
                <div>
                  <div className="font-serif text-2xl text-vetiver">From hustle</div>
                  <div className="font-serif text-2xl italic text-ochre">to structure.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* WHAT WE DO */}
      <section className="relative overflow-hidden border-y border-border bg-card py-20">
        <OrbitingNodes className="pointer-events-none absolute -right-16 top-10 size-72 text-vetiver opacity-60" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
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

      {/* CEO MESSAGE */}
      <CeoMessage />

      {/* WHY LOVETECH — trust */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ochre">Why us</p>
            <h2 className="font-serif text-4xl text-vetiver md:text-5xl">Why Businesses Work With Lovetech</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Nigerian market expertise",
              "Practical finance-readiness support",
              "Training that leads to action",
              "Tools, templates, and implementation support",
              "Digital and AI-enabled advisory",
              "Support for MSMEs, agribusinesses, women, youth, and cooperatives",
            ].map((t) => (
              <div key={t} className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-3 size-2 rounded-full bg-ochre" />
                <p className="font-serif text-xl leading-snug text-vetiver">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="border-y border-border bg-bone px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ochre">Who we serve</p>
            <h2 className="font-serif text-4xl text-vetiver md:text-5xl">Built for the people building Nigerian enterprise</h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "MSMEs and startups",
              "Agribusinesses and agro-processors",
              "Cooperatives and farmer groups",
              "Women and youth-led businesses",
              "Development programmes and NGOs",
              "BMOs and enterprise support organisations",
              "Consultants and professionals",
              "Institutions and donor-funded projects",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 rounded-lg border border-border bg-card p-5 text-foreground/80">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-vetiver" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
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
              title="AI for Business — Basic"
              body="A practical beginner course helping Nigerian entrepreneurs and small teams use AI to save time and grow their business."
              priceLaunch="₦8,900"
              to="/academy"
              cta="View Course"
              featured
            />
            <CourseCard
              status="Enrolment Open"
              title="Advanced AI Modules"
              body="Advanced AI for marketing, service, finance, admin and research — all 5 modules for ₦25,000 or ₦15,000 each."
              priceLaunch="₦25,000"
              to="/academy"
              cta="View Bundle"
            />
            <CourseCard
              status="Waiting List"
              title="Finance Readiness for MSMEs"
              body="Prepare your business for loans, grants, investments and partnership funding."
              to="/academy"
              cta="Join Waiting List"
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

      {/* MARQUEE STRIP */}
      <section aria-hidden="true" className="overflow-hidden border-y border-border bg-bone py-6">
        <div className="flex w-max gap-12 whitespace-nowrap font-serif text-3xl text-vetiver/70 lt-marquee md:text-4xl">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex items-center gap-12">
              {["Capital", "Capacity", "Code", "Agrofinance", "Climate-smart", "MSME Growth", "Access to Finance", "Impact"].map((w) => (
                <span key={w} className="flex items-center gap-12">
                  <span className="italic">{w}</span>
                  <SproutMark className="size-7 shrink-0" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* CTA BAND */}
      <section className="px-6 py-24 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-vetiver p-10 text-bone md:p-16">
          <FloatingLeaves className="-right-10 -top-10 size-[360px] opacity-30" />
          <OrbitingNodes className="pointer-events-none absolute -left-20 -bottom-20 size-80 text-bone opacity-25" />
          <div className="relative grid items-center gap-8 md:grid-cols-[2fr_1fr]">
            <div>
              <h2 className="mb-4 text-balance font-serif text-4xl md:text-5xl">Ready to build a more structured and growth-ready business?</h2>
              <p className="max-w-xl text-bone/75">Book a consultation, start your finance readiness diagnostic, or enrol in the Academy.</p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Link to="/contact" className="rounded-lg bg-ochre px-6 py-3 text-center font-semibold text-ink shadow-sm hover:opacity-95">Book a Consultation</Link>
              <Link to="/finance-readiness" className="rounded-lg border border-white/30 px-6 py-3 text-center font-semibold text-white hover:bg-white/10">Start Finance Readiness Diagnostic</Link>
              <Link to="/academy" className="rounded-lg bg-white/10 px-6 py-3 text-center font-semibold text-white hover:bg-white/20">Explore Academy</Link>

            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

function CeoMessage() {
  return (
    <section className="relative bg-bone px-6 py-24 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ochre">Message from the CEO</p>
          <h2 className="font-serif text-4xl leading-tight text-vetiver md:text-5xl">Development must be practical.</h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
            <img
              src={avessAsset.url}
              alt="Avess Abutu, Founder & CEO of LoveTech Agrofinance & Development"
              width={904}
              height={1131}
              className="aspect-[4/5] w-full object-cover object-top"
              loading="lazy"
            />
            <div className="p-6">
              <p className="font-serif text-2xl text-vetiver">Avess Abutu</p>
              <p className="mt-1 text-sm text-foreground/60">Founder / CEO</p>
              <p className="text-sm text-foreground/60">Lovetech Agrofinance &amp; Development</p>
            </div>
          </div>
        </div>
        <div className="space-y-5 text-[15px] leading-relaxed text-foreground/80">
          <p>At Lovetech Agrofinance &amp; Development, our vision is simple: to help businesses, entrepreneurs, cooperatives, and development-focused institutions become more structured, finance-ready, and future-ready.</p>
          <p>Across Nigeria and Africa, many businesses have strong ideas, hardworking founders, and real market potential. However, they often struggle with structure, access to finance, digital systems, compliance, business planning, and the practical tools needed to grow sustainably. Lovetech Agro was created to close that gap.</p>
          <p>We combine business development, agrofinance advisory, training, technology, and practical consulting to support small businesses, agribusinesses, SMEs, cooperatives, and institutions. Our work is rooted in real business needs: helping entrepreneurs organise their operations, prepare for funding, improve their records, strengthen their market positioning, and use digital and AI tools to work smarter.</p>
          <p>Through our consulting services, academy programmes, finance readiness tools, and business support solutions, we are building a platform that does more than advise. We equip, guide, and walk with our clients from idea to structure, from structure to growth, and from growth to sustainable impact.</p>
          <p>As CEO, I believe that development must be practical. Training must lead to action. Finance must meet readiness. Technology must solve real problems. And every business we support should leave better organised, more confident, and more prepared for opportunity.</p>
          <p className="font-serif text-xl italic text-vetiver">Welcome to Lovetech Agrofinance &amp; Development.</p>
        </div>
      </div>
    </section>
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

function CourseCard({ status, title, body, priceRegular, priceLaunch, to, hash, cta, featured }: { status: string; title: string; body: string; priceRegular?: string; priceLaunch?: string; to: string; hash?: string; cta: string; featured?: boolean }) {
  return (
    <article className={`flex flex-col rounded-2xl border p-6 ${featured ? "border-transparent bg-white/10 ring-1 ring-white/20" : "border-white/10 bg-white/5"}`}>
      <span className={`mb-4 inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${featured ? "bg-ochre text-ink" : "bg-white/10 text-white/80"}`}>
        {status}
      </span>
      <h3 className="mb-2 font-serif text-2xl text-white">{title}</h3>
      <p className="mb-6 flex-1 text-sm text-white/70">{body}</p>
      {priceLaunch && (
        <div className="mb-6 flex items-baseline gap-2">
          {priceRegular && <span className="text-sm text-white/40 line-through">{priceRegular}</span>}
          <span className="text-2xl font-bold text-ochre">{priceLaunch}</span>
        </div>
      )}
      <Link to={to} hash={hash} className={`rounded-lg py-2.5 text-center text-sm font-semibold ${featured ? "bg-ochre text-ink hover:opacity-95" : "border border-white/30 text-white hover:bg-white/10"}`}>
        {cta}
      </Link>
    </article>
  );
}

