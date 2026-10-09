import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, Clock, GraduationCap, MonitorSmartphone, Users, ClipboardCheck, MessageSquare, Target } from "lucide-react";
import { findCourse } from "@/lib/academy-catalogue";
import { WaitlistForm } from "@/components/waitlist-form";

export const Route = createFileRoute("/academy/courses/$slug")({
  loader: ({ params }) => {
    const course = findCourse(params.slug);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Course not found — LoveTech Academy" }, { name: "robots", content: "noindex" }] };
    const c = loaderData.course;
    const title = `${c.title} — LoveTech Agro Academy`;
    return {
      meta: [
        { title },
        { name: "description", content: c.short },
        { property: "og:title", content: title },
        { property: "og:description", content: c.short },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: CourseNotFound,
  component: CoursePage,
});

function CourseNotFound() {
  return (
    <main className="px-6 py-24 text-center">
      <h1 className="font-serif text-3xl text-vetiver">Course not found</h1>
      <Link to="/academy" className="mt-6 inline-block font-semibold text-teal underline">Back to Academy</Link>
    </main>
  );
}

function CoursePage() {
  const { course: c } = Route.useLoaderData();
  return (
    <main className="bg-background">
      <section className="bg-ink px-6 py-16 text-bone lg:px-8 md:py-20">
        <div className="mx-auto max-w-5xl">
          <Link to="/academy" className="text-xs font-semibold uppercase tracking-widest text-ochre">← LoveTech Academy</Link>
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-bone/60">{c.pathway} pathway{c.hybrid ? " · Hybrid programme" : ""}</p>
          <h1 className="mt-2 font-serif text-3xl text-bone md:text-5xl">{c.title}</h1>
          <p className="mt-5 max-w-3xl text-base text-bone/75 md:text-lg">{c.description}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Fact icon={<GraduationCap className="size-4" />} k="Level" v={c.level} />
            <Fact icon={<Clock className="size-4" />} k="Duration" v={c.duration} />
            <Fact icon={<MonitorSmartphone className="size-4" />} k="Delivery" v={c.delivery} />
          </div>
          <a href="#register" className="mt-8 inline-flex rounded-lg bg-ochre px-6 py-3 text-sm font-bold text-ink">Start Course</a>
        </div>
      </section>

      {c.hybrid && (
        <section className="border-b border-border px-6 py-12 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-2xl text-vetiver">How this programme works</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Step icon={<MonitorSmartphone className="size-5" />} t="Online learning" b="Short, low-data lessons and downloads on your phone." />
              <Step icon={<Users className="size-5" />} t="Practical sessions" b="Face-to-face sessions with your cohort and facilitator." />
              <Step icon={<MessageSquare className="size-5" />} t="Coaching" b="At least two coaching touchpoints per cohort." />
              <Step icon={<Target className="size-5" />} t="Action planning" b="Submit a practical plan for your business." />
            </div>
          </div>
        </section>
      )}

      {c.modules.length > 0 && (
        <section className="px-6 py-12 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-2xl text-vetiver">Course modules</h2>
            <ol className="mt-6 space-y-3">
              {c.modules.map((m) => (
                <li key={m.title} className="rounded-xl border border-border bg-card p-4 font-semibold text-vetiver">{m.title}</li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {c.outputs.length > 0 && (
        <section className="border-y border-border bg-muted/40 px-6 py-12 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-2xl text-vetiver">{c.outputsTitle}</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {c.outputs.map((o) => (
                <li key={o} className="flex gap-2 text-sm text-foreground/80"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal" />{o}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {c.whoFor.length > 0 && (
        <section className="px-6 py-12 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-2xl text-vetiver">Who this is for</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {c.whoFor.map((w) => (
                <li key={w} className="flex gap-2 text-sm text-foreground/80"><ClipboardCheck className="mt-0.5 size-4 shrink-0 text-teal" />{w}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section id="register" className="px-6 pb-20 pt-4 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-2 font-serif text-2xl text-vetiver">Register for the next cohort</h2>
          <p className="mb-6 text-sm text-foreground/70">Enrolment for this course opens by cohort. Register now and we will contact you with dates, fees and your learner access.</p>
          <WaitlistForm courseSlug={c.slug} courseLabel={c.title} />
        </div>
      </section>
    </main>
  );
}

function Fact({ icon, k, v }: { icon: React.ReactNode; k: string; v: string }) {
  return (
    <div className="rounded-xl border border-bone/15 bg-bone/5 p-4">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-bone/60">{icon}{k}</p>
      <p className="mt-1 text-sm font-semibold text-bone">{v}</p>
    </div>
  );
}

function Step({ icon, t, b }: { icon: React.ReactNode; t: string; b: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 grid size-10 place-items-center rounded-lg bg-teal/10 text-teal">{icon}</div>
      <p className="font-semibold text-vetiver">{t}</p>
      <p className="mt-1 text-sm text-foreground/65">{b}</p>
    </div>
  );
}
