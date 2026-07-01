import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, Clock, Trophy } from "lucide-react";
import { getCourseAssessments, submitAssignment } from "@/lib/assessments.functions";

export const Route = createFileRoute("/_authenticated/academy/dashboard/courses/$slug/assignment/$assignmentId")({
  head: () => ({ meta: [{ title: "Assignment · LoveTech Agro Academy" }] }),
  component: AssignmentPage,
});

function AssignmentPage() {
  const { slug, assignmentId } = Route.useParams();
  const qc = useQueryClient();
  const fetchFn = useServerFn(getCourseAssessments);
  const submit = useServerFn(submitAssignment);

  const { data, isLoading, error } = useQuery({
    queryKey: ["course-assessments", slug],
    queryFn: () => fetchFn({ data: { slug } }),
  });

  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [ok, setOk] = useState(false);

  const assn = data?.assignments.find((a) => a.id === assignmentId);
  const sub = data?.submissions.find((s) => s.assignment_id === assignmentId);

  useEffect(() => {
    if (sub) {
      setText(sub.submission_text ?? "" as any);
    }
  }, [sub?.id]);

  const mut = useMutation({
    mutationFn: () => submit({ data: {
      assignment_id: assignmentId,
      submission_text: text.trim() || undefined,
      submission_url: url.trim() || undefined,
    } }),
    onSuccess: () => {
      setOk(true);
      qc.invalidateQueries({ queryKey: ["course-assessments", slug] });
    },
  });

  if (isLoading) return <main className="grid min-h-[50vh] place-items-center text-sm text-foreground/60">Loading…</main>;
  if (error) return <main className="mx-auto max-w-2xl px-6 py-24 text-center text-foreground/70">{(error as Error).message}</main>;
  if (!assn) return <main className="mx-auto max-w-2xl px-6 py-24 text-center text-foreground/70">Assignment not found.</main>;

  const needsText = assn.submission_type !== "url";
  const needsUrl = assn.submission_type !== "text";
  const isGraded = sub?.status === "graded";

  return (
    <main className="bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-6 py-6 lg:px-8">
          <Link to="/academy/dashboard/courses/$slug/assessments" params={{ slug }} className="mb-2 inline-flex items-center gap-1 text-xs text-vetiver hover:underline"><ArrowLeft className="size-3" /> Back</Link>
          <h1 className="font-serif text-2xl text-vetiver md:text-3xl">{assn.title}</h1>
          <p className="mt-2 text-xs text-foreground/60">Max score: {assn.max_points}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-6 px-6 py-8 lg:px-8">
        <article className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-2 font-serif text-lg text-vetiver">Instructions</h2>
          <p className="whitespace-pre-wrap text-sm text-foreground/80">{assn.instructions}</p>
        </article>

        {isGraded && (
          <div className="rounded-2xl border border-ochre/40 bg-ochre/5 p-5">
            <div className="mb-1 inline-flex items-center gap-2 text-ochre"><Trophy className="size-4" /> <strong>Graded</strong></div>
            <p className="text-2xl font-bold text-vetiver">{sub!.score} / {assn.max_points}</p>
            {sub!.feedback && <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/75"><strong>Feedback:</strong> {sub!.feedback}</p>}
          </div>
        )}

        {!isGraded && sub && (
          <div className="rounded-md border border-border bg-muted/40 p-3 text-xs text-foreground/70">
            <Clock className="mr-1 inline size-3" /> Submitted {sub.submitted_at ? new Date(sub.submitted_at).toLocaleString() : ""} — you can update until it's graded.
          </div>
        )}

        {!isGraded && (
          <form
            className="space-y-4 rounded-2xl border border-border bg-card p-6"
            onSubmit={(e) => { e.preventDefault(); setOk(false); mut.mutate(); }}
          >
            {needsText && (
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-vetiver">Your submission</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={10}
                  maxLength={20000}
                  required={!needsUrl}
                  className="w-full rounded-md border border-border bg-background p-3 text-sm"
                  placeholder="Write your response here…"
                />
              </div>
            )}
            {needsUrl && (
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-vetiver">Link (Google Drive, Dropbox, etc.)</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  maxLength={500}
                  required={!needsText}
                  className="w-full rounded-md border border-border bg-background p-3 text-sm"
                  placeholder="https://…"
                />
              </div>
            )}
            {ok && <p className="text-sm text-vetiver inline-flex items-center gap-1"><CheckCircle2 className="size-4" /> Submitted.</p>}
            {mut.error && <p className="text-sm text-destructive">{(mut.error as Error).message}</p>}
            <button
              type="submit"
              disabled={mut.isPending}
              className="rounded-sm bg-vetiver px-6 py-3 text-sm font-semibold text-bone disabled:opacity-50"
            >
              {mut.isPending ? "Submitting…" : sub ? "Update submission" : "Submit assignment"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
