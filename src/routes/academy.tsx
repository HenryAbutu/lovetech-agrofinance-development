import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, GraduationCap, Sparkles, PlayCircle, Users, BookOpen } from "lucide-react";
import academyHero from "@/assets/academy-hero.jpg";
import aiEdgeImg from "@/assets/course-ai-edge.jpg";
import icssImg from "@/assets/course-icss.jpg";
import financeImg from "@/assets/course-finance.jpg";

export const Route = createFileRoute("/academy")({
  head: () => ({
    meta: [
      { title: "LoveTech Agro Academy — Practical courses for entrepreneurs" },
      { name: "description", content: "AI, entrepreneurship, finance readiness and digital skills for Nigerian MSMEs and professionals." },
      { property: "og:title", content: "LoveTech Agro Academy" },
      { property: "og:image", content: academyHero },
    ],
  }),
  component: AcademyPage,
});

const ENROL_LINK = "/academy/courses/professionals-ai-edge" as const;
const ENROL_HASH = "enrol";

function AcademyPage() {
  return (
    <main>
      {/* Hero with image */}
      <section className="relative overflow-hidden bg-ink text-bone">
        <div className="absolute inset-0">
          <img
            src={academyHero}
            alt="LoveTech Agro Academy learners in a Nigerian classroom"
            className="h-full w-full object-cover opacity-40"
            width={1600}
            height={900}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--ochre)" }}>
            <Sparkles className="size-3.5" /> LoveTech Agro Academy
          </p>
          <h1 className="max-w-3xl font-serif text-5xl text-bone md:text-7xl">Practical courses for entrepreneurs, professionals and value chain actors.</h1>
          <p className="mt-6 max-w-2xl text-lg text-bone/75">Self-paced and cohort-based training in AI, entrepreneurship, finance readiness, agribusiness and digital tools — built for the realities of Nigerian business.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={ENROL_LINK} hash={ENROL_HASH} className="inline-flex items-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold text-white" style={{ backgroundColor: "var(--academy)" }}>
              <PlayCircle className="size-4" /> Enroll in AI Edge — ₦1,000
            </Link>
            <Link to="/signup" className="rounded-sm border border-bone/20 px-6 py-3 text-sm font-semibold text-bone hover:bg-bone/10">Create learner account</Link>
          </div>
          <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-bone/15 pt-6 text-bone/85">
            <Stat icon={<Users className="size-4" />} k="500+" v="Learners trained" />
            <Stat icon={<BookOpen className="size-4" />} k="3" v="Live programmes" />
            <Stat icon={<GraduationCap className="size-4" />} k="6 wks" v="Average duration" />
          </dl>
        </div>
      </section>

      {/* Courses */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ochre">Courses</p>
              <h2 className="font-serif text-4xl text-vetiver">Choose your next skill</h2>
            </div>
            <Link to={ENROL_LINK} hash={ENROL_HASH} className="hidden text-sm font-semibold text-vetiver underline-offset-4 hover:underline md:inline">Skip to enrolment →</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <CourseCard
              img={aiEdgeImg}
              status="Enrolment Open"
              title="Professionals AI Edge"
              body="Practical AI tools for more efficient, productive and profitable businesses."
              meta="Deadline · 15 June 2026"
              priceOld="₦10,000"
              priceNew="₦1,000"
              to={ENROL_LINK} hash={ENROL_HASH}
              cta="Enroll Now"
              featured
            />
            <CourseCard
              img={icssImg}
              status="Coming Soon"
              title="ICSS 2.0 Entrepreneurship"
              body="Entrepreneurship training for MSME growth, finance readiness and market access."
              meta="Cohort opens soon"
              to="/academy/courses/icss-2-0-entrepreneurship"
              cta="Join Waitlist"
            />
            <CourseCard
              img={financeImg}
              status="Coming Soon"
              title="Finance Readiness for MSMEs"
              body="Prepare your business for loans, grants, investments and partnership funding."
              meta="Cohort opens soon"
              to="/academy/courses/finance-readiness-msmes"
              cta="Join Waitlist"
            />
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="bg-card border-y border-border px-6 py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
          <Pillar icon={<GraduationCap className="size-5" />} title="Practitioners, not theorists" body="Every course is built and delivered by people doing the work in Nigerian businesses." />
          <Pillar icon={<Sparkles className="size-5" />} title="Built for application" body="Workbooks, templates and exercises so you can apply what you learn the next day." />
          <Pillar icon={<ArrowRight className="size-5" />} title="Pathway to support" body="Graduates connect with our consulting and finance-readiness pathways." />
        </div>
      </section>

      {/* CTA band */}
      <section className="relative overflow-hidden bg-ink px-6 py-20 text-bone lg:px-8">
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 80% 50%, var(--academy), transparent 55%)" }} />
        <div className="relative mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl">Ready to start with AI Edge?</h2>
            <p className="mt-2 max-w-xl text-bone/70">Join the launch cohort for ₦1,000. Deadline 15 June 2026.</p>
          </div>
          <Link to={ENROL_LINK} hash={ENROL_HASH} className="inline-flex items-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold text-white" style={{ backgroundColor: "var(--academy)" }}>
            Enroll Now <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function Stat({ icon, k, v }: { icon: React.ReactNode; k: string; v: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-2 text-ochre">{icon}<span className="text-xs uppercase tracking-wider">{v}</span></div>
      <div className="font-serif text-3xl">{k}</div>
    </div>
  );
}

function Pillar({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div>
      <div className="mb-3 grid size-10 place-items-center rounded-sm bg-vetiver/10 text-vetiver">{icon}</div>
      <h3 className="mb-2 font-serif text-2xl text-vetiver">{title}</h3>
      <p className="text-sm text-foreground/65">{body}</p>
    </div>
  );
}

function CourseCard({ img, status, title, body, meta, priceOld, priceNew, to, hash, cta, featured }: { img: string; status: string; title: string; body: string; meta?: string; priceOld?: string; priceNew?: string; to: string; hash?: string; cta: string; featured?: boolean }) {
  return (
    <article className={`group flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-xl ${featured ? "border-academy ring-1 ring-academy/30" : "border-border"}`}>
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img src={img} alt={title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" width={1280} height={832} />
        <span className="absolute left-3 top-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur"
          style={{ backgroundColor: featured ? "color-mix(in oklab, var(--academy) 90%, transparent)" : "color-mix(in oklab, var(--ink) 75%, transparent)", color: "white" }}>
          {status}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 font-serif text-2xl text-vetiver">{title}</h3>
        <p className="mb-4 flex-1 text-sm text-foreground/65">{body}</p>
        {meta && <p className="mb-3 text-xs text-foreground/55">{meta}</p>}
        {priceNew && (
          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-sm text-foreground/40 line-through">{priceOld}</span>
            <span className="text-2xl font-bold text-ochre">{priceNew}</span>
          </div>
        )}
        <Link to={to} hash={hash} className={`rounded-sm py-2.5 text-center text-sm font-semibold ${featured ? "text-white" : "border border-vetiver/20 text-vetiver hover:bg-vetiver/5"}`} style={featured ? { backgroundColor: "var(--academy)" } : undefined}>
          {cta}
        </Link>
      </div>
    </article>
  );
}
