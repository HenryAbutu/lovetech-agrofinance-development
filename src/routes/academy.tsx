import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, GraduationCap, Sparkles } from "lucide-react";

export const Route = createFileRoute("/academy")({
  head: () => ({
    meta: [
      { title: "LoveTech Agro Academy — Practical courses for entrepreneurs" },
      { name: "description", content: "AI, entrepreneurship, finance readiness and digital skills for Nigerian MSMEs and professionals." },
      { property: "og:title", content: "LoveTech Agro Academy" },
    ],
  }),
  component: AcademyPage,
});

function AcademyPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-ink px-6 py-24 text-bone lg:px-8 lg:py-32">
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 20% 30%, var(--academy), transparent 50%)" }} />
        <div className="relative mx-auto max-w-5xl">
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--ochre)" }}>
            <Sparkles className="size-3.5" /> LoveTech Agro Academy
          </p>
          <h1 className="font-serif text-5xl text-bone md:text-7xl">Practical courses for entrepreneurs, professionals and value chain actors.</h1>
          <p className="mt-6 max-w-2xl text-lg text-bone/70">Self-paced and cohort-based training in AI, entrepreneurship, finance readiness, agribusiness and digital tools — built for the realities of Nigerian business.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/academy/courses/professionals-ai-edge" className="rounded-sm px-6 py-3 text-sm font-semibold text-white" style={{ backgroundColor: "var(--academy)" }}>Enroll in AI Edge</Link>
            <Link to="/signup" className="rounded-sm border border-bone/20 px-6 py-3 text-sm font-semibold text-bone hover:bg-bone/10">Create learner account</Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 font-serif text-4xl text-vetiver">Courses</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <CourseCard
              status="Enrolment Open"
              title="Professionals AI Edge"
              body="Practical AI tools for more efficient, productive and profitable businesses."
              meta="Deadline · 15 June 2026"
              priceOld="₦10,000"
              priceNew="₦1,000"
              to="/academy/courses/professionals-ai-edge"
              cta="Enroll Now"
              featured
            />
            <CourseCard
              status="Coming Soon"
              title="ICSS 2.0 Entrepreneurship Programme"
              body="Entrepreneurship training for MSME growth, finance readiness and market access."
              meta="Cohort opens soon"
              to="/academy/courses/icss-2-0-entrepreneurship"
              cta="Join Waitlist"
            />
            <CourseCard
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

      <section className="bg-card border-y border-border px-6 py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
          <div>
            <div className="mb-3 grid size-10 place-items-center rounded-sm bg-vetiver/10 text-vetiver"><GraduationCap className="size-5" /></div>
            <h3 className="mb-2 font-serif text-2xl text-vetiver">Practitioners, not theorists</h3>
            <p className="text-sm text-foreground/65">Every course is built and delivered by people doing the work in Nigerian businesses.</p>
          </div>
          <div>
            <div className="mb-3 grid size-10 place-items-center rounded-sm bg-vetiver/10 text-vetiver"><Sparkles className="size-5" /></div>
            <h3 className="mb-2 font-serif text-2xl text-vetiver">Built for application</h3>
            <p className="text-sm text-foreground/65">Workbooks, templates and exercises so you can apply what you learn the next day.</p>
          </div>
          <div>
            <div className="mb-3 grid size-10 place-items-center rounded-sm bg-vetiver/10 text-vetiver"><ArrowRight className="size-5" /></div>
            <h3 className="mb-2 font-serif text-2xl text-vetiver">Pathway to support</h3>
            <p className="text-sm text-foreground/65">Graduates connect with our consulting and finance-readiness pathways.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function CourseCard({ status, title, body, meta, priceOld, priceNew, to, cta, featured }: { status: string; title: string; body: string; meta?: string; priceOld?: string; priceNew?: string; to: string; cta: string; featured?: boolean }) {
  return (
    <article className={`flex flex-col rounded-2xl border p-6 ${featured ? "border-academy bg-card ring-1 ring-academy/30" : "border-border bg-card"}`}>
      <span className="mb-3 inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
        style={{ backgroundColor: featured ? "color-mix(in oklab, var(--academy) 15%, transparent)" : "var(--muted)", color: featured ? "var(--academy)" : "var(--foreground)" }}>
        {status}
      </span>
      <h3 className="mb-2 font-serif text-2xl text-vetiver">{title}</h3>
      <p className="mb-4 flex-1 text-sm text-foreground/65">{body}</p>
      {meta && <p className="mb-3 text-xs text-foreground/55">{meta}</p>}
      {priceNew && (
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-sm text-foreground/40 line-through">{priceOld}</span>
          <span className="text-2xl font-bold text-ochre">{priceNew}</span>
        </div>
      )}
      <Link to={to} className={`rounded-sm py-2.5 text-center text-sm font-semibold ${featured ? "text-white" : "border border-vetiver/20 text-vetiver hover:bg-vetiver/5"}`} style={featured ? { backgroundColor: "var(--academy)" } : undefined}>
        {cta}
      </Link>
    </article>
  );
}
