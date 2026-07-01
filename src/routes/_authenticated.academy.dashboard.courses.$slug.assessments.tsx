import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ClipboardCheck, FileEdit, CheckCircle2, Clock, XCircle, Trophy, ArrowRight } from "lucide-react";
import { getCourseAssessments } from "@/lib/assessments.functions";

export const Route = createFileRoute("/_authenticated/academy/dashboard/courses/$slug/assessments")({
  head: () => ({ meta: [{ title: "Assessments · LoveTech Agro Academy" }] }),
  component: AssessmentsPage,
});

function AssessmentsPage() {
  const { slug } = Route.useParams();
  const fetchFn = useServerFn(getCourseAssessments);
  const { data, isLoading, error } = useQuery({
    queryKey: ["course-assessments", slug],
    queryFn: () => fetchFn({ data: { slug } }),
  });

  if (isLoading) return <main className="grid min-h-[50vh] place-items-center text-sm text-foreground/60">Loading assessments…</main>;
  if (error) return <main className="mx-auto max-w-2xl px-6 py-24 text-center text-foreground/70">{(error as Error).message}</main>;
  if (!data) return null;

  const bestScoreByQuiz = new Map<string, { score: number; passed: boolean }>();
  for (const a of data.attempts) {
    const cur = bestScoreByQuiz.get(a.quiz_id);
    if (!cur || Number(a.score) > cur.score) bestScoreByQuiz.set(a.quiz_id, { score: Number(a.score), passed: a.passed });
  }
  const subByAssn = new Map(data.submissions.map((s) => [s.assignment_id, s]));

  return (
    <main className="bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-6 py-6 lg:px-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-ochre">Assessments</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="font-serif text-2xl text-vetiver md:text-3xl">{data.course.title}</h1>
            <Link to="/academy/dashboard/courses/$slug" params={{ slug }} className="text-sm text-vetiver hover:underline">← Back to course</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-10 px-6 py-8 lg:px-8">
        {/* Quizzes */}
        <section>
          <div className="mb-4 flex items-center gap-2 text-vetiver">
            <ClipboardCheck className="size-5" /><h2 className="font-serif text-xl">Quizzes</h2>
          </div>
          {data.quizzes.length === 0 && <EmptyState label="No quizzes published yet." />}
          <div className="space-y-3">
            {data.quizzes.map((q) => {
              const best = bestScoreByQuiz.get(q.id);
              return (
                <div key={q.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-5">
                  <div className="flex-1 min-w-[240px]">
                    <h3 className="font-serif text-lg text-vetiver">{q.title}</h3>
                    {q.description && <p className="mt-1 text-sm text-foreground/70">{q.description}</p>}
                    <p className="mt-2 text-xs text-foreground/60">Pass score: {q.pass_score}% · Max attempts: {q.max_attempts}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {best ? (
                      best.passed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-vetiver/10 px-3 py-1 text-xs font-semibold text-vetiver"><CheckCircle2 className="size-3" /> Passed · {best.score}%</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive"><XCircle className="size-3" /> Best {best.score}%</span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-foreground/60"><Clock className="size-3" /> Not attempted</span>
                    )}
                    <Link
                      to="/academy/dashboard/courses/$slug/quiz/$quizId"
                      params={{ slug, quizId: q.id }}
                      className="inline-flex items-center gap-1 rounded-sm bg-vetiver px-4 py-2 text-xs font-semibold text-bone"
                    >
                      {best?.passed ? "Retake" : "Start quiz"} <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Assignments */}
        <section>
          <div className="mb-4 flex items-center gap-2 text-vetiver">
            <FileEdit className="size-5" /><h2 className="font-serif text-xl">Assignments</h2>
          </div>
          {data.assignments.length === 0 && <EmptyState label="No assignments published yet." />}
          <div className="space-y-3">
            {data.assignments.map((a) => {
              const sub = subByAssn.get(a.id);
              return (
                <div key={a.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-5">
                  <div className="flex-1 min-w-[240px]">
                    <h3 className="font-serif text-lg text-vetiver">{a.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-foreground/70">{a.instructions}</p>
                    <p className="mt-2 text-xs text-foreground/60">Max score: {a.max_points} · Submit as: {a.submission_type}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {sub?.status === "graded" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-ochre/15 px-3 py-1 text-xs font-semibold text-ink"><Trophy className="size-3" /> Graded · {sub.score}/{a.max_points}</span>
                    ) : sub?.status === "submitted" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-foreground/70"><Clock className="size-3" /> Under review</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-foreground/60">Not submitted</span>
                    )}
                    <Link
                      to="/academy/dashboard/courses/$slug/assignment/$assignmentId"
                      params={{ slug, assignmentId: a.id }}
                      className="inline-flex items-center gap-1 rounded-sm bg-vetiver px-4 py-2 text-xs font-semibold text-bone"
                    >
                      {sub ? "View / Update" : "Start assignment"} <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-serif text-lg text-vetiver">See how you rank</h3>
          <p className="mt-1 text-sm text-foreground/70">Compare your points with other learners in this course.</p>
          <Link to="/academy/dashboard/courses/$slug/leaderboard" params={{ slug }} className="mt-4 inline-flex items-center gap-2 rounded-sm bg-ochre px-4 py-2 text-sm font-semibold text-ink">
            <Trophy className="size-4" /> View leaderboard
          </Link>
        </div>
      </div>
    </main>
  );
}

function EmptyState({ label }: { label: string }) {
  return <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-foreground/60">{label}</div>;
}
