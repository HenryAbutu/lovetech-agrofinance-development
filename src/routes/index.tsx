import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Building2, GraduationCap, Leaf, LineChart, Briefcase, Sprout, Cpu, ClipboardCheck,
  BookOpen, UserPlus, MonitorPlay, FileCheck2, Target, MessageCircle, Award, Quote, CheckCircle2,
} from "lucide-react";
import heroImg from "@/assets/group/hero-advisory-session.jpg";
import academyImg from "@/assets/group/academy-workshop.jpg";
import financeImg from "@/assets/group/finance-review.jpg";
import house8Img from "@/assets/group/house8-pool.png";
import rubyImg from "@/assets/group/rubychai-hero.png";
import avessImg from "@/assets/avess-abutu.png";
import { Button } from "@/components/ui/button";

const URL = "https://lovetechgroup.lovable.app/";
const TITLE = "Lovetech Agrofinance & Development — Advisory, Academy LMS & Finance Readiness";
const DESC = "Lovetech Agrofinance & Development helps MSMEs, agribusinesses, cooperatives and development programmes become finance-ready, market-ready and digitally enabled through advisory, the Lovetech Academy LMS and programme support.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: Home,
});

const lmsCourses = [
  { slug: "ai-for-businesses", title: "AI for Businesses: Practical AI Skills for Nigerian SMEs", status: "Enrolment / Waitlist", cta: "View Course", tone: "bg-teal/15 text-teal" },
  { slug: "finance-readiness-msmes", title: "Finance Readiness for MSMEs", status: "Coming Soon", cta: "Join Waitlist", tone: "bg-gold/20 text-navy" },
  { slug: "agribusiness-skills", title: "Agribusiness Skills for Value Addition, Market Access and Certification Readiness", status: "Private Cohorts", cta: "View Programme", tone: "bg-navy/10 text-navy" },
  { slug: "business-automation-smes", title: "Business Automation for SMEs", status: "Coming Soon", cta: "Join Waitlist", tone: "bg-gold/20 text-navy" },
] as const;

const services = [
  { icon: LineChart, t: "Finance Readiness & Access to Finance", b: "We help businesses prepare for loans, grants, investor conversations and procurement opportunities through diagnostics, business plans, financial records, pitch documents and funding-readiness support." },
  { icon: Briefcase, t: "Business Development Advisory", b: "We support MSMEs, agribusinesses, cooperatives and startups with business structuring, growth planning, operations improvement, market positioning and implementation support." },
  { icon: GraduationCap, t: "Lovetech Academy LMS", b: "We deliver practical online and hybrid courses with videos, templates, assignments, assessments, coaching, action plans and certificates." },
  { icon: Sprout, t: "Agribusiness & Value Chain Development", b: "We support agribusinesses and agricultural programmes with value addition, market access, training, certification readiness, youth and women inclusion, and enterprise development." },
  { icon: Cpu, t: "Digital Transformation & AI for SMEs", b: "We help organisations use AI, automation, forms, dashboards, CRM tools and digital workflows to improve sales, operations, reporting and customer service." },
  { icon: ClipboardCheck, t: "Research, M&E and Programme Support", b: "We support development programmes with assessments, surveys, curriculum development, hybrid training delivery, reporting, dashboards and evidence documentation." },
];

const steps = [
  { icon: BookOpen, t: "Choose a course", b: "Select a practical course or join a programme waitlist." },
  { icon: UserPlus, t: "Register or sign in", b: "Create your learner account using email or Google." },
  { icon: MonitorPlay, t: "Learn online", b: "Access videos, notes, templates and downloadable resources." },
  { icon: FileCheck2, t: "Complete assignments", b: "Submit practical tasks linked to your business." },
  { icon: Target, t: "Build your action plan", b: "Prepare a business, finance, market or implementation plan." },
  { icon: MessageCircle, t: "Receive support", b: "Get guidance through coaching, WhatsApp or facilitator support." },
  { icon: Award, t: "Complete and progress", b: "Track completion and certificate status." },
];

const audiences = [
  "MSMEs and startups", "Agribusinesses and agro-processors", "Cooperatives and farmer groups", "Women and youth-led businesses",
  "Development programmes and NGOs", "BMOs and enterprise support organisations", "Consultants and professionals", "Institutions and donor-funded projects",
];

const ventures = [
  { to: "/house-8" as const, img: house8Img, icon: Building2, name: "House 8 Shortlet Apartments", body: "A 5-bedroom luxury apartment in Dawaki, Abuja." },
  { to: "/ruby-chai" as const, img: rubyImg, icon: Leaf, name: "Ruby Chai Wellness", body: "Herbal tea blends and everyday wellness rituals." },
];

const btnPrimary = "inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-navy hover:opacity-95";
const btnGhostDark = "inline-flex items-center gap-2 rounded-lg border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10";
const btnNavy = "inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white hover:opacity-95";
const btnOutline = "inline-flex items-center gap-2 rounded-lg border border-navy/20 bg-white px-6 py-3 text-sm font-semibold text-navy hover:bg-cloud";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-widest text-teal">{children}</p>;
}

function Home() {
  return (
    <main>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
          <div>
            <p className="mb-5 inline-flex rounded-full bg-teal/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal">Lovetech Agrofinance &amp; Development</p>
            <h1 className="font-serif text-3xl font-bold leading-[1.12] md:text-5xl">
              Lovetech Agrofinance &amp; Development helps businesses become <span className="text-gold">finance-ready, market-ready and digitally enabled.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base text-white/75 md:text-lg">
              We provide advisory services, business development support, finance readiness tools, digital transformation solutions, and practical online learning for MSMEs, agribusinesses, cooperatives, institutions, and development programmes across Nigeria and Africa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/academy" className={btnPrimary}>Explore Lovetech Academy LMS <ArrowRight className="size-4" /></Link>
              <Link to="/finance-readiness" className={btnGhostDark}>Start Finance Readiness Diagnostic</Link>
              <Link to="/contact" className={btnGhostDark}>Book a Consultation</Link>
            </div>
            <p className="mt-10 border-t border-white/10 pt-6 text-xs font-medium tracking-wide text-white/60 md:text-sm">
              Advisory • Academy • Finance Readiness • Agribusiness • Digital Transformation • Programme Support
            </p>
          </div>
          <img src={heroImg} alt="Lovetech advisory session with Nigerian business owners" width={1600} height={1200} className="rounded-2xl object-cover shadow-2xl" />
        </div>
      </section>

      {/* 2. LMS announcement */}
      <section className="border-b border-border bg-cloud px-6 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-widest text-navy">New</p>
            <h2 className="mt-4 font-serif text-3xl font-bold text-navy md:text-4xl">Learn through the Lovetech Academy LMS</h2>
            <p className="mt-4 text-foreground/75">
              Our lightweight LMS gives entrepreneurs, MSMEs, agribusinesses, cooperatives and programme participants access to practical courses, downloadable templates, assignments, assessments, action plans and certificates. Whether you are learning AI for business, preparing for finance, or joining a hybrid agribusiness programme, Lovetech Academy helps you move from knowledge to implementation.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {lmsCourses.map((c) => (
              <div key={c.slug} className="flex flex-col rounded-2xl border border-border bg-white p-5 shadow-sm">
                <span className={`self-start rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${c.tone}`}>{c.status}</span>
                <h3 className="mt-4 flex-1 font-serif text-base font-semibold leading-snug text-navy">{c.title}</h3>
                <Link to="/academy/courses/$slug" params={{ slug: c.slug }} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal hover:underline">
                  {c.cta} <ArrowRight className="size-4" />
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/academy" className={btnNavy}>Go to Academy LMS <ArrowRight className="size-4" /></Link>
            <Link to="/academy" className={btnOutline}>Join a Course Waitlist</Link>
            <Link to="/academy/dashboard" className={btnOutline}>View My Academy</Link>
          </div>
        </div>
      </section>

      {/* 3. What we do */}
      <section className="px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>Our work</Eyebrow>
          <h2 className="mt-3 max-w-3xl font-serif text-3xl font-bold text-navy md:text-4xl">What Lovetech Agrofinance &amp; Development Does</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.t} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <span className="grid size-11 place-items-center rounded-xl bg-teal/10 text-teal"><s.icon className="size-5" /></span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-navy">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Finance readiness diagnostic */}
      <section className="bg-navy px-6 py-16 text-white lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <img src={financeImg} alt="Reviewing business financial records" loading="lazy" className="rounded-2xl object-cover shadow-xl" />
          <div>
            <h2 className="mt-3 font-serif text-3xl font-bold md:text-4xl">Finance Readiness Diagnostic</h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-primary-foreground/80">
              <p>Many businesses need funding, but are not yet fully prepared to approach banks, investors, grant programmes, development partners, or procurement opportunities.</p>
              <p>The Lovetech Finance Readiness Diagnostic helps MSMEs, agribusinesses, cooperatives, startups, and growing enterprises understand where they stand and what they need to strengthen before seeking finance.</p>
              <p>Through a simple diagnostic process, we assess your business structure, registration status, records, revenue model, financial documentation, funding need, repayment or accountability plan, and overall readiness for loans, grants, investment, or enterprise support programmes.</p>
              <p>After completing the diagnostic, Lovetech can support you with the next practical steps, including business profiling, financial records, pitch documents, business plans, proposal support, market positioning, and finance-readiness advisory.</p>
            </div>
            <p className="mt-6 border-t border-primary-foreground/20 pt-5 text-sm leading-relaxed text-primary-foreground/80"><strong className="text-primary-foreground">Best for:</strong> MSMEs, agribusinesses, cooperatives, women/youth-led businesses, startups, and enterprises preparing for funding or growth support.</p>
            <Button asChild variant="secondary" className="mt-8 h-auto max-w-full whitespace-normal bg-gold px-6 py-3 text-navy hover:bg-gold/90">
              <Link to="/finance-readiness">Start Finance Readiness Diagnostic <ArrowRight className="size-4 shrink-0" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 5. How the academy works (featured learning) */}
      <section className="px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>Featured courses</Eyebrow>
          <h2 className="mt-3 font-serif text-3xl font-bold text-navy md:text-4xl">How Lovetech Academy Works</h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.t} className="rounded-2xl border border-border bg-white p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded-full bg-navy text-xs font-bold text-white">{i + 1}</span>
                  <s.icon className="size-5 text-teal" />
                </div>
                <h3 className="mt-4 font-semibold text-navy">{s.t}</h3>
                <p className="mt-2 text-sm text-foreground/70">{s.b}</p>
              </li>
            ))}
            <li className="flex flex-col justify-center rounded-2xl bg-teal/10 p-5">
              <p className="font-serif text-lg font-semibold text-navy">Ready to start?</p>
              <Link to="/academy" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-teal hover:underline">Browse all courses <ArrowRight className="size-4" /></Link>
            </li>
          </ol>
        </div>
      </section>

      {/* 6. Who we serve */}
      <section className="bg-cloud px-6 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>Who we serve</Eyebrow>
          <h2 className="mt-3 font-serif text-3xl font-bold text-navy md:text-4xl">Who We Serve</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((a) => (
              <div key={a} className="rounded-xl border border-border bg-white p-5 text-sm font-semibold text-navy">{a}</div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Programme support */}
      <section className="px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>Programme implementation &amp; donor support</Eyebrow>
            <h2 className="mt-3 font-serif text-3xl font-bold text-navy md:text-4xl">Programme Design, Training Delivery and Evidence Support</h2>
            <p className="mt-4 text-foreground/75">Lovetech supports institutions and development programmes with skills assessments, curriculum development, hybrid training, coaching, participant action planning, monitoring, reporting and evidence documentation.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/programmes" className={btnNavy}>View Programme Support <ArrowRight className="size-4" /></Link>
              <Link to="/contact" className={btnOutline}>Book a Consultation</Link>
            </div>
          </div>
          <img src={academyImg} alt="Lovetech hybrid training workshop" loading="lazy" className="rounded-2xl object-cover shadow-lg" />
        </div>
      </section>

      {/* 8. Digital & AI */}
      <section className="bg-navy px-6 py-16 text-white lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">Digital transformation</p>
          <h2 className="mt-3 max-w-3xl font-serif text-3xl font-bold md:text-4xl">Digital transformation and AI solutions for growing businesses</h2>
          <div className="mt-5 max-w-3xl space-y-4 text-base leading-relaxed text-primary-foreground/80">
            <p>Lovetech helps businesses and organisations use digital tools, AI, automation, forms, dashboards, and lightweight systems to work smarter and operate more efficiently.</p>
            <p>Our digital and AI solutions are designed for real business needs: customer follow-up, sales tracking, online learning, business records, reporting, content creation, customer service, data collection, workflow automation, and management dashboards.</p>
            <p>We support SMEs, consultants, training organisations, development programmes, and institutions to adopt practical technology without unnecessary complexity. From AI-assisted documents and customer-service workflows to LMS portals, CRM-style forms, dashboards, and automated reporting systems, we help organisations turn digital tools into everyday operational value.</p>
          </div>
          <p className="mt-8 font-semibold text-primary-foreground">Our support includes:</p>
          <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {["AI business tools and workflow design", "Lightweight LMS and training portals", "Customer service and lead capture systems", "Digital forms, dashboards, and reporting tools", "Business automation for sales, operations, and follow-up", "AI training for teams, SMEs, consultants, and professionals"].map((x) => (
              <li key={x} className="flex items-start gap-3 border-t border-primary-foreground/20 py-4 text-sm font-medium leading-relaxed text-primary-foreground/85"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal" />{x}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="secondary" className="h-auto max-w-full whitespace-normal bg-gold px-6 py-3 text-navy hover:bg-gold/90">
              <Link to="/contact">Request Digital Transformation Support <ArrowRight className="size-4 shrink-0" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 9. Group ventures */}
      <section className="px-6 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>Lovetech Group Ventures</Eyebrow>
          <h2 className="mt-3 font-serif text-2xl font-bold text-navy md:text-3xl">Lovetech Group Ventures</h2>
          <p className="mt-3 max-w-3xl text-sm text-foreground/70">Beyond our advisory and academy work, the Lovetech ecosystem also includes hospitality, wellness and product ventures that reflect our commitment to enterprise development, service excellence and practical innovation.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {ventures.map((v) => (
              <Link key={v.to} to={v.to} className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-white p-3 shadow-sm transition hover:shadow-md">
                <img src={v.img} alt={v.name} loading="lazy" className="size-24 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-serif font-semibold text-navy"><v.icon className="size-4 text-teal" /> {v.name}</p>
                  <p className="mt-1 text-sm text-foreground/70">{v.body}</p>
                </div>
                <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CEO message */}
      <section className="bg-cloud px-6 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <img src={avessImg} alt="Avess Abutu, Founder & CEO, Lovetech Agrofinance & Development" loading="lazy" className="w-full max-w-sm rounded-2xl object-cover shadow-lg" />
          <div>
            <Eyebrow>CEO message</Eyebrow>
            <h2 className="mt-3 font-serif text-3xl font-bold text-navy md:text-4xl">Led by practitioners, not theorists</h2>
            <p className="mt-5 text-foreground/75">
              Lovetech is led by <strong className="text-navy">Avess Abutu</strong>, whose work spans agrofinance, enterprise development and business advisory across Nigeria. African businesses do not lack ambition — they lack structure, tools and access.
            </p>
            <p className="mt-4 text-foreground/70">That conviction shapes everything we do: advisory that produces documents funders accept, and courses people actually finish and apply.</p>
            <Link to="/about" className={`${btnNavy} mt-8`}>About Lovetech <ArrowRight className="size-4" /></Link>
          </div>
        </div>
      </section>

      {/* 11. Testimonials placeholder */}
      <section className="px-6 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>Project experience</Eyebrow>
          <h2 className="mt-3 font-serif text-3xl font-bold text-navy md:text-4xl">What clients and participants say</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <figure key={n} className="rounded-2xl border border-dashed border-border bg-white p-6">
                <Quote className="size-6 text-teal" />
                <blockquote className="mt-3 text-sm italic text-foreground/60">Testimonial coming soon.</blockquote>
                <figcaption className="mt-4 text-xs font-semibold text-foreground/50">Client / programme partner</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Final CTA */}
      <section className="bg-navy px-6 py-16 text-center text-white lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl font-bold md:text-4xl">Ready to build a stronger, finance-ready and digitally enabled business?</h2>
          <p className="mt-4 text-white/75">Whether you need advisory support, training, finance readiness, digital tools or programme implementation, Lovetech Agrofinance &amp; Development can help you take the next practical step.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/academy" className={btnPrimary}>Explore Academy LMS</Link>
            <Link to="/finance-readiness" className={btnGhostDark}>Start Finance Diagnostic</Link>
            <Link to="/contact" className={btnGhostDark}>Book a Consultation</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
