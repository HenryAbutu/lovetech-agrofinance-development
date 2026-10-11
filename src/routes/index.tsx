import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight, Building2, GraduationCap, Leaf, LineChart, Briefcase, Sprout, Cpu, ClipboardCheck, BookOpen, UserPlus, MonitorPlay, FileCheck2, Target, MessageCircle, Award, Quote, Download, Users, Handshake, Globe, BarChart3, Bot, Workflow, LayoutDashboard } from "lucide-react";
import heroImg from "@/assets/group/hero-advisory-session.jpg";
import academyImg from "@/assets/group/academy-workshop.jpg";
import financeImg from "@/assets/group/finance-review.jpg";
import digitalImg from "@/assets/group/digital-business.jpg";
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

const courses = [
  { slug: "ai-for-businesses", title: "AI for Businesses", text: "Practical AI tools for Nigerian SMEs.", status: "Enrolment / Waitlist", cta: "View Course", icon: Bot },
  { slug: "finance-readiness-msmes", title: "Finance Readiness for MSMEs", text: "Prepare for loans, grants and investor conversations.", status: "Coming Soon", cta: "Join Waitlist", icon: LineChart },
  { slug: "agribusiness-skills", title: "Agribusiness Skills", text: "Value addition, market access and certification readiness.", status: "Private Cohorts", cta: "View Programme", icon: Sprout },
  { slug: "business-automation-smes", title: "Business Automation", text: "Simple systems for sales, records and customer follow-up.", status: "Coming Soon", cta: "Join Waitlist", icon: Workflow },
] as const;
const services = [
  { icon: LineChart, title: "Finance Readiness", text: "Diagnostics, records, business plans and funding documents.", to: "/finance-readiness" },
  { icon: Briefcase, title: "Business Advisory", text: "Structure, strategy, operations and growth support.", to: "/advisory" },
  { icon: GraduationCap, title: "Academy LMS", text: "Practical courses, templates, assignments and certificates.", to: "/academy" },
  { icon: Sprout, title: "Agribusiness Development", text: "Value chains, market access, processing and certification readiness.", to: "/advisory" },
  { icon: Cpu, title: "Digital & AI Solutions", text: "Automation, dashboards, AI tools and customer-service workflows.", to: "/contact" },
  { icon: ClipboardCheck, title: "Research & Programme Support", text: "Surveys, curriculum, M&E, reporting and evidence systems.", to: "/programmes" },
] as const;
const audiences = [
  { icon: Briefcase, title: "MSMEs & startups" }, { icon: Sprout, title: "Agribusinesses" },
  { icon: Handshake, title: "Cooperatives" }, { icon: Users, title: "Women & youth-led businesses" },
  { icon: Globe, title: "NGOs & development programmes" }, { icon: BookOpen, title: "Consultants & professionals" },
  { icon: Building2, title: "BMOs & institutions" }, { icon: Target, title: "Donor-funded projects" },
];
const programmeSupport = [
  { icon: ClipboardCheck, title: "Skills assessment" }, { icon: BookOpen, title: "Curriculum design" },
  { icon: MonitorPlay, title: "Hybrid training" }, { icon: MessageCircle, title: "Coaching & action plans" },
  { icon: BarChart3, title: "Evidence reporting" },
];
const digitalServices = [
  { icon: Bot, title: "AI business tools" }, { icon: MessageCircle, title: "Customer service workflows" },
  { icon: LayoutDashboard, title: "Dashboards and reports" }, { icon: GraduationCap, title: "LMS and training portals" },
];
const ventures = [
  { to: "/house-8", img: house8Img, name: "House 8 Apartments" },
  { to: "/ruby-chai", img: rubyImg, name: "Ruby Chai Wellness" },
] as const;
const band = "px-6 py-14 lg:px-8 lg:py-20";
const heading = "font-display text-3xl font-bold leading-tight tracking-normal md:text-4xl";
const cta = "h-auto min-h-11 max-w-full whitespace-normal px-5 py-3 text-center leading-snug";
function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <p className={`mb-3 text-xs font-bold uppercase tracking-widest ${dark ? "text-accent" : "text-primary"}`}>{children}</p>;
}
function Home() {
  return (
    <main>
      <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
        <img src={heroImg} alt="Lovetech advisory session with Nigerian business owners" width={1600} height={1200} fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-navy-deep/80 lg:bg-navy-deep/70" />
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <Eyebrow dark>Lovetech Agrofinance &amp; Development</Eyebrow>
            <h1 className="font-display text-3xl font-bold leading-tight tracking-normal md:text-5xl">Lovetech Agrofinance &amp; Development helps businesses become <span className="text-accent">finance-ready, market-ready and digitally enabled.</span></h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/90 md:text-lg">Advisory, finance-readiness, digital tools and practical learning for MSMEs, agribusinesses, cooperatives and development programmes.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild variant="homepage" className={cta}><Link to="/academy">Explore Academy LMS <ArrowRight /></Link></Button>
              <Button asChild variant="homepageOutline" className={cta}><Link to="/finance-readiness">Start Finance Readiness Diagnostic</Link></Button>
              <Button asChild variant="homepageOutline" className={cta}><Link to="/contact">Book a Consultation</Link></Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2 border-t border-primary-foreground/20 pt-6">
              {["Advisory", "Academy LMS", "Finance Readiness", "Agribusiness", "Digital & AI", "Programme Support"].map(label => <li key={label} className="rounded-md border border-primary-foreground/25 bg-primary/30 px-3 py-1.5 text-xs font-medium">{label}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className={`${band} border-b border-border bg-muted`}>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-2xl"><Eyebrow>Now live · Practical learning</Eyebrow><h2 className={heading}>Lovetech Academy LMS is live</h2><p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">Practical online and hybrid learning with videos, templates, assignments, assessments, action plans and certificates.</p></div>
            <Button asChild variant="outline" className={cta}><Link to="/academy">Join a Course Waitlist <ArrowRight /></Link></Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map(c => <article key={c.slug} className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground">
              <div className="flex h-24 items-center justify-between bg-primary/5 px-5"><c.icon className="size-9 text-primary" strokeWidth={1.5} /><span className="rounded-md bg-accent/20 px-2 py-1 text-[11px] font-semibold text-foreground">{c.status}</span></div>
              <div className="flex flex-1 flex-col p-5"><h3 className="min-h-12 font-display text-lg font-bold leading-snug">{c.title}</h3><p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{c.text}</p><Button asChild variant="link" className="mt-5 h-auto justify-start self-start p-0"><Link to="/academy/courses/$slug" params={{ slug: c.slug }}>{c.cta} <ArrowRight /></Link></Button></div>
            </article>)}
          </div>
          <ul className="mt-6 grid gap-4 border-y border-border py-5 sm:grid-cols-2 lg:grid-cols-5">
            {[{ icon: MonitorPlay, label: "Watch lessons" }, { icon: Download, label: "Download templates" }, { icon: FileCheck2, label: "Submit assignments" }, { icon: Target, label: "Build action plans" }, { icon: Award, label: "Track completion" }].map(x => <li key={x.label} className="flex items-center gap-2 text-sm font-medium"><x.icon className="size-4 shrink-0 text-primary" />{x.label}</li>)}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3"><Button asChild variant="link" className="px-0"><Link to="/academy">Go to Academy LMS <ArrowRight /></Link></Button><Button asChild variant="link"><Link to="/academy/dashboard">View My Academy <ArrowRight /></Link></Button></div>
        </div>
      </section>

      <section className={band}><div className="mx-auto max-w-7xl"><Eyebrow>Advisory to implementation</Eyebrow><h2 className={heading}>What Lovetech Does</h2><p className="mt-4 text-muted-foreground">We combine advisory, academy, finance-readiness and digital implementation support.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{services.map(s => <article key={s.title} className="flex flex-col rounded-lg border border-border bg-card p-6"><s.icon className="size-7 text-primary" strokeWidth={1.5} /><h3 className="mt-5 font-display text-lg font-bold">{s.title}</h3><p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p><Button asChild variant="link" className="mt-5 h-auto justify-start self-start p-0"><Link to={s.to}>Learn more <ArrowRight /></Link></Button></article>)}</div>
      </div></section>

      <section className={`${band} bg-primary text-primary-foreground`}><div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <img src={financeImg} alt="Reviewing business financial records" loading="lazy" width={1280} height={960} className="aspect-[4/3] w-full rounded-lg object-cover" />
        <div><Eyebrow dark>Prepare for your next opportunity</Eyebrow><h2 className={heading}>Finance Readiness</h2><p className="mt-4 max-w-xl leading-relaxed text-primary-foreground/85">We help businesses prepare for loans, grants, investors and procurement opportunities with diagnostics, records, business plans and funding documents.</p>
          <div className="my-6 grid grid-cols-2 gap-3">{[{ icon: ClipboardCheck, title: "Readiness diagnostic" }, { icon: BarChart3, title: "Business records review" }, { icon: FileCheck2, title: "Business plan and pitch documents" }, { icon: Briefcase, title: "Funding application support" }].map(x => <div key={x.title} className="flex flex-col gap-3 rounded-lg border border-primary-foreground/25 bg-primary-foreground/5 p-4"><x.icon className="size-6 text-accent" /><h3 className="text-sm font-semibold leading-relaxed">{x.title}</h3></div>)}</div>
          <Button asChild variant="homepage" className={cta}><Link to="/finance-readiness">Start Finance Readiness Diagnostic <ArrowRight /></Link></Button>
        </div>
      </div></section>

      <section className={band}><div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2"><div><Eyebrow>Enterprise across the value chain</Eyebrow><h2 className={heading}>Agribusiness Development</h2><p className="mt-4 leading-relaxed text-muted-foreground">We support agribusinesses, cooperatives, processors and value-chain actors with value addition, market access, business management and certification readiness.</p><div className="mt-6 grid grid-cols-2 gap-3">{[{ icon: Sprout, title: "Value addition" }, { icon: Globe, title: "Market access" }, { icon: Handshake, title: "Cooperative and farmer group support" }, { icon: Award, title: "Certification readiness" }].map(x => <div key={x.title} className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"><x.icon className="size-6 text-primary" /><h3 className="text-sm font-semibold leading-relaxed">{x.title}</h3></div>)}</div><Button asChild className={`${cta} mt-6`}><Link to="/advisory">Explore Agribusiness Support <ArrowRight /></Link></Button></div><img src={academyImg} alt="Business and training workshop supporting enterprise development" loading="lazy" width={1280} height={960} className="aspect-[4/3] w-full rounded-lg object-cover" /></div></section>

      <section className={`${band} bg-muted`}><div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2"><img src={digitalImg} alt="Business owner and adviser using digital customer records and reports" loading="lazy" width={1280} height={960} className="aspect-[4/3] w-full rounded-lg object-cover" /><div><Eyebrow>Practical technology</Eyebrow><h2 className={heading}>Digital &amp; AI Solutions</h2><p className="mt-4 leading-relaxed text-muted-foreground">We help SMEs and institutions use AI, forms, dashboards, CRM-style tools and automation to work smarter.</p><div className="mt-6 grid grid-cols-2 gap-3">{digitalServices.map(x => <div key={x.title} className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"><x.icon className="size-6 text-primary" /><h3 className="text-sm font-semibold leading-relaxed">{x.title}</h3></div>)}</div><Button asChild className={`${cta} mt-6`}><Link to="/contact">Request Digital Support <ArrowRight /></Link></Button></div></div></section>

      <section className={band}><div className="mx-auto max-w-7xl"><div className="grid items-center gap-8 lg:grid-cols-2"><div><Eyebrow>Programme implementation</Eyebrow><h2 className={heading}>Programme Support for Institutions</h2><p className="mt-4 leading-relaxed text-muted-foreground">We support skills assessments, curriculum development, hybrid training, coaching, reporting and evidence documentation.</p><div className="mt-6 flex flex-wrap gap-3"><Button asChild className={cta}><Link to="/contact">Book a Programme Consultation <ArrowRight /></Link></Button><Button asChild variant="link" className={cta}><Link to="/programmes">View Programme Support</Link></Button></div></div><img src={academyImg} alt="Lovetech hybrid training workshop" loading="lazy" width={1280} height={960} className="aspect-[16/9] w-full rounded-lg object-cover" /></div>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{programmeSupport.map(x => <li key={x.title} className="flex items-start gap-3 border-t border-border pt-5"><x.icon className="size-5 shrink-0 text-primary" /><span className="text-sm font-semibold">{x.title}</span></li>)}</ul>
      </div></section>

      <section className={`${band} bg-muted`}><div className="mx-auto max-w-7xl"><Eyebrow>Enterprise & development</Eyebrow><h2 className={heading}>Who We Serve</h2><div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">{audiences.map(a => <div key={a.title} className="flex min-h-28 flex-col items-start gap-4 rounded-lg border border-border bg-card p-5"><a.icon className="size-6 shrink-0 text-primary" strokeWidth={1.5} /><h3 className="text-sm font-semibold leading-relaxed">{a.title}</h3></div>)}</div></div></section>

      <section className={band}><div className="mx-auto max-w-7xl"><h2 className="font-display text-2xl font-bold tracking-normal md:text-3xl">Lovetech Group Ventures</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">Our wider ecosystem includes hospitality, wellness and product ventures built around enterprise, service and innovation.</p><div className="mt-6 grid gap-5 sm:grid-cols-2">{ventures.map(v => <article key={v.to} className="overflow-hidden rounded-lg border border-border bg-card"><img src={v.img} alt={v.name} loading="lazy" className="aspect-[3/1] w-full object-cover" /><div className="p-5"><Button asChild variant="link" className="h-auto w-full justify-between p-0 text-base"><Link to={v.to}>{v.name} <ArrowRight /></Link></Button></div></article>)}</div></div></section>

      <section className={`${band} bg-muted`}><div className="mx-auto flex max-w-5xl flex-col items-start gap-8 md:flex-row md:items-center"><img src={avessImg} alt="Avess Abutu, Founder and CEO" loading="lazy" className="aspect-square w-44 shrink-0 rounded-lg object-cover object-top md:w-56" /><div><Eyebrow>From the CEO</Eyebrow><h2 className={heading}>From the CEO</h2><p className="mt-4 max-w-2xl text-lg leading-relaxed">At Lovetech, we believe development must be practical. We help businesses move from ideas to structure, from structure to growth, and from growth to sustainable impact.</p><p className="mt-5 font-bold">Avess Abutu <span className="ml-2 text-sm font-normal text-muted-foreground">Founder/CEO</span></p><Button asChild variant="link" className="mt-4 h-auto px-0"><Link to="/about">Read More About Lovetech <ArrowRight /></Link></Button></div></div></section>

      <section className={band}><div className="mx-auto max-w-7xl"><h2 className="font-display text-2xl font-bold tracking-normal md:text-3xl">What clients and participants say</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{["Client story coming soon", "Programme feedback coming soon", "Learner testimonial coming soon"].map(t => <div key={t} className="flex items-center gap-4 rounded-lg border border-dashed border-border p-5"><Quote className="size-6 shrink-0 text-muted-foreground" /><p className="text-sm text-muted-foreground">{t}</p></div>)}</div></div></section>

      <section className={`${band} bg-primary text-center text-primary-foreground`}><div className="mx-auto max-w-3xl"><h2 className={heading}>Ready to build a stronger business?</h2><p className="mt-4 text-primary-foreground/85">Start with training, finance-readiness or advisory support.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Button asChild variant="homepage" className={cta}><Link to="/academy">Explore Academy LMS <ArrowRight /></Link></Button><Button asChild variant="homepageOutline" className={cta}><Link to="/finance-readiness">Start Diagnostic</Link></Button><Button asChild variant="homepageOutline" className={cta}><Link to="/contact">Book Consultation</Link></Button></div></div></section>

    </main>
  );
}
