import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { getQuizForAttempt, submitQuizAttempt } from "@/lib/assessments.functions";

export const Route = createFileRoute("/_authenticated/academy/dashboard/courses/$slug/quiz/$quizId")({
  head: () => ({ meta: [{ title: "Quiz · LoveTech Agro Academy" }] }),
  component: QuizPage,
});

function QuizPage() {
  const { slug, quizId } = Route.useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const fetchQuiz = useServerFn(getQuizForAttempt);
  const submit = useServerFn(submitQuizAttempt);

  const { data, isLoading, error } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => fetchQuiz({ data: { quiz_id: quizId } }),
  });

  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean; earned_points: number; total_points: number } | null>(null);

  const mut = useMutation({
    mutationFn: () => submit({ data: { quiz_id: quizId, answers } }),
    onSuccess: (res) => {
      setResult(res);
      qc.invalidateQueries({ queryKey: ["course-assessments", slug] });
    },
  });

  if (isLoading) return <main className="grid min-h-[50vh] place-items-center text-sm text-foreground/60">Loading quiz…</main>;
  if (error) return <main className="mx-auto max-w-2xl px-6 py-24 text-center text-foreground/70">{(error as Error).message}</main>;
  if (!data) return null;

  const remaining = data.quiz.max_attempts - data.attempts.length;
  const toggle = (qId: string, optId: string, multi: boolean) => {
    setAnswers((prev) => {
      const cur = prev[qId] ?? [];
      if (multi) {
        return { ...prev, [qId]: cur.includes(optId) ? cur.filter((x) => x !== optId) : [...cur, optId] };
      }
      return { ...prev, [qId]: [optId] };
    });
  };

  if (result) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className={`mx-auto mb-6 grid size-20 place-items-center rounded-full ${result.passed ? "bg-vetiver/10 text-vetiver" : "bg-destructive/10 text-destructive"}`}>
          {result.passed ? <CheckCircle2 className="size-10" /> : <XCircle className="size-10" />}
        </div>
        <h1 className="font-serif text-3xl text-vetiver">{result.passed ? "Passed!" : "Not yet"}</h1>
        <p className="mt-2 text-lg text-foreground/70">You scored <strong>{result.score}%</strong> ({result.earned_points}/{result.total_points} points)</p>
        <p className="mt-1 text-sm text-foreground/60">Pass score: {data.quiz.pass_score}%</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/academy/dashboard/courses/$slug/assessments" params={{ slug }} className="rounded-sm border border-border px-5 py-2.5 text-sm font-semibold">Back to assessments</Link>
          {!result.passed && remaining > 1 && (
            <button onClick={() => { setAnswers({}); setResult(null); qc.invalidateQueries({ queryKey: ["quiz", quizId] }); }} className="rounded-sm bg-vetiver px-5 py-2.5 text-sm font-semibold text-bone">Try again</button>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-6 py-6 lg:px-8">
          <Link to="/academy/dashboard/courses/$slug/assessments" params={{ slug }} className="mb-2 inline-flex items-center gap-1 text-xs text-vetiver hover:underline"><ArrowLeft className="size-3" /> Back</Link>
          <h1 className="font-serif text-2xl text-vetiver md:text-3xl">{data.quiz.title}</h1>
          {data.quiz.description && <p className="mt-1 text-sm text-foreground/70">{data.quiz.description}</p>}
          <p className="mt-2 text-xs text-foreground/60">Pass score: {data.quiz.pass_score}% · Attempts remaining: {remaining} of {data.quiz.max_attempts}</p>
        </div>
      </div>

      <form
        className="mx-auto max-w-3xl space-y-6 px-6 py-8 lg:px-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (data.questions.some((q) => !(answers[q.id]?.length))) {
            alert("Answer all questions before submitting.");
            return;
          }
          mut.mutate();
        }}
      >
        {remaining <= 0 && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">You've used all attempts for this quiz.</div>
        )}
        {data.questions.map((q, idx) => {
          const multi = q.question_type === "multi_choice";
          return (
            <fieldset key={q.id} className="rounded-2xl border border-border bg-card p-5">
              <legend className="mb-3 font-serif text-base text-vetiver">Q{idx + 1}. {q.prompt}</legend>
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const checked = answers[q.id]?.includes(opt.id) ?? false;
                  return (
                    <label key={opt.id} className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm transition-colors ${checked ? "border-vetiver bg-vetiver/5" : "border-border hover:bg-muted"}`}>
                      <input
                        type={multi ? "checkbox" : "radio"}
                        name={q.id}
                        checked={checked}
                        onChange={() => toggle(q.id, opt.id, multi)}
                        className="mt-0.5"
                      />
                      <span className="text-foreground/85">{opt.text}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
        {data.questions.length === 0 && <div className="rounded-md border border-dashed p-6 text-center text-sm text-foreground/60">This quiz has no questions yet.</div>}
        <div className="flex items-center justify-between">
          {mut.error && <p className="text-sm text-destructive">{(mut.error as Error).message}</p>}
          <button
            type="submit"
            disabled={mut.isPending || remaining <= 0 || data.questions.length === 0}
            className="ml-auto rounded-sm bg-vetiver px-6 py-3 text-sm font-semibold text-bone disabled:opacity-50"
          >
            {mut.isPending ? "Submitting…" : "Submit quiz"}
          </button>
        </div>
      </form>
    </main>
  );
}
