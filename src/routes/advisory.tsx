import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, GraduationCap, LineChart, ClipboardCheck, Cpu, Users, Sprout } from "lucide-react";
import heroImg from "@/assets/group/hero-advisory-session.jpg";
import financeImg from "@/assets/group/finance-review.jpg";
import academyImg from "@/assets/group/academy-workshop.jpg";

const URL = "https://lovetechgroup.lovable.app/advisory";

export const Route = createFileRoute("/advisory")({
  head: () => ({
    meta: [
      { title: "LoveTech Advisory & Academy — Business Advisory & Practical Training" },
      { name: "description", content: "Business advisory, finance readiness, digital & AI support and practical training for Nigerian MSMEs, agribusinesses and professionals." },
      { property: "og:title", content: "LoveTech Advisory & Academy" },
      { property: "og:description", content: "Business advisory, finance readiness, digital & AI support and practical training for Nigerian MSMEs and professionals." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: AdvisoryPage,
});

const pillars = [
  { icon: LineChart, t: "Finance Readiness", b: "Loan and grant readiness, business plans, financial models, records and pitch materials that lenders and funders take seriously." },
  { icon: ClipboardCheck, t: "Business Advisory", b: "Diagnostics, structure, pricing, operations and governance support for owner-managed businesses ready to grow." },
  { icon: GraduationCap, t: "Academy Training", b: "Practical, affordable online courses on entrepreneurship, finance, AI and digital tools — with certificates." },
  { icon: Cpu, t: "Digital & AI Support", b: "Apply AI, automation and simple digital tools to marketing, sales, records and day-to-day operations." },
  { icon: Users, t: "Programmes & Partners", b: "Programme design, MSME cohorts, cooperative strengthening and enterprise-support delivery for institutions." },
  { icon: Sprout, t: "Agribusiness Support", b: "Value-chain advisory, climate-smart enterprise support, market linkages and investment-ready packaging." },
];

const steps = [
  { n: "01", t: "Diagnose", b: "We review your records, structure, funding gaps and growth barriers." },
  { n: "02", t: "Design", b: "You get a practical action plan, tools and priorities — not theory." },
  { n: "03", t: "Build capacity", b: "Training and coaching for you and your team." },
  { n: "04", t: "Implement & track", b: "We support delivery and review outcomes with you." },
];

function AdvisoryPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-teal/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal">LoveTech Advisory & Academy</p>
            <h1 className="font-serif text-4xl font-bold leading-tight md:text-5xl">From hustle to structure — advisory and training that actually moves the business</h1>
            <p className="mt-5 max-w-xl text-white/75">
              We help Nigerian MSMEs, agribusinesses and professionals get organised, get fundable and get growing — through hands-on advisory and practical, affordable courses.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/finance-readiness" className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-navy hover:opacity-95">Start free diagnostic <ArrowRight className="size-4" /></Link>
              <Link to="/academy" className="rounded-lg border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">Browse courses</Link>
            </div>
          </div>
          <img src={heroImg} alt="LoveTech advisory session with Nigerian business owners in Abuja" width={1600} height={1200} className="rounded-2xl object-cover shadow-2xl" />
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-3xl font-bold text-navy md:text-4xl">What we do</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.t} className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <p.icon className="size-6 text-teal" />
                <h3 className="mt-4 font-serif text-lg font-semibold text-navy">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">{p.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cloud px-6 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <img src={financeImg} alt="Business owner reviewing financial records" loading="lazy" width={1600} height={1200} className="rounded-2xl object-cover shadow-lg" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal">How we work</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-navy md:text-4xl">A clear four-step engagement</h2>
            <div className="mt-8 space-y-6">
              {steps.map((s) => (
                <div key={s.n} className="flex gap-4">
                  <span className="font-serif text-lg font-bold text-gold">{s.n}</span>
                  <div>
                    <h3 className="font-semibold text-navy">{s.t}</h3>
                    <p className="text-sm text-foreground/70">{s.b}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal">LoveTech Agro Academy</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-navy md:text-4xl">Short, practical courses you can finish and apply</h2>
            <ul className="mt-6 space-y-3 text-sm text-foreground/75">
              {["Self-paced video lessons with downloadable tools", "Quizzes, assignments and certificates", "Affordable Naira pricing with secure card payment", "Access on phone or laptop, anytime"].map((x) => (
                <li key={x} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal" />{x}</li>
              ))}
            </ul>
            <Link to="/academy" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white hover:opacity-95">Explore the Academy <ArrowRight className="size-4" /></Link>
          </div>
          <img src={academyImg} alt="Nigerian entrepreneurs in a LoveTech training workshop" loading="lazy" width={1600} height={1200} className="rounded-2xl object-cover shadow-lg" />
        </div>
      </section>
    </main>
  );
}
