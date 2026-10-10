import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Circle, PlayCircle, FileText, Download, ClipboardList, ClipboardCheck, Users, MessageSquare, ArrowRight, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { findCourse } from "@/lib/academy-catalogue";
import { ASSESSMENTS, LEARNABLE, RESOURCES, downloadResource, type Lesson } from "@/lib/learning-content";
import { courseSummary, useLearnerData, useRefreshLearner } from "@/lib/use-learner-data";

export const Route = createFileRoute("/_authenticated/academy/learn/$slug")({
  head: () => ({ meta: [{ title: "Learn — LoveTech Academy" }, { name: "robots", content: "noindex" }] }),
  component: LearnPage,
});

const ICONS: Record<Lesson["type"], React.ReactNode> = {
  video: <PlayCircle className="size-4" />, reading: <FileText className="size-4" />, download: <Download className="size-4" />,
  assignment: <ClipboardList className="size-4" />, assessment: <ClipboardCheck className="size-4" />,
  live: <Users className="size-4" />, coaching: <MessageSquare className="size-4" />,
};

function LearnPage() {
  const { slug } = Route.useParams();
  const course = findCourse(slug);
  const { data, isLoading, error } = useLearnerData();
  const refresh = useRefreshLearner();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sum = useMemo(() => (data && course ? courseSummary(data, slug) : null), [data, course, slug]);

  if (!course || !LEARNABLE.has(slug)) {
    return (
      <main className="px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-vetiver">This course isn't open for learning yet</h1>
        <Link to="/academy" className="mt-6 inline-block font-semibold text-teal underline">Back to Academy</Link>
      </main>
    );
  }
  if (error) return <main className="p-10 text-center text-sm text-destructive">{(error as Error).message}</main>;
  if (isLoading || !sum || !data) return <main className="grid min-h-[50vh] place-items-center text-sm text-foreground/60">Loading your course…</main>;

  const enrolled = isEnrolled(data, slug);
  const preview = previewKeys(data, slug);
  const canOpen = (key: string) => enrolled || preview.has(key);

  if (!enrolled && preview.size === 0) return <NotEnrolled slug={slug} />;

  const active = sum.lessons.find((l) => l.key === activeKey && canOpen(l.key))
    ?? (enrolled ? sum.nextLesson ?? sum.lessons[0] : sum.lessons.find((l) => preview.has(l.key))!);
  const idx = sum.lessons.findIndex((l) => l.key === active.key);
  const next = sum.lessons.slice(idx + 1).find((l) => canOpen(l.key));
  const isDone = sum.done.has(active.key);
  function open(key: string) {
    if (!canOpen(key)) return toast.error(NOT_ENROLLED_MSG);
    setActiveKey(key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function toggleComplete() {
    setBusy(true);
    const q = isDone
      ? supabase.from("lms_lesson_progress").delete().eq("user_id", data!.userId).eq("course_slug", slug).eq("lesson_key", active.key)
      : supabase.from("lms_lesson_progress").insert({ user_id: data!.userId, course_slug: slug, lesson_key: active.key });
    const { error } = await q;
    setBusy(false);
    if (error) return toast.error(error.message);
    await refresh();
    if (!isDone) toast.success("Lesson marked complete");
  }

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link to="/academy/dashboard" className="text-xs font-semibold uppercase tracking-widest text-ochre">← My Academy</Link>
        <h1 className="mt-2 text-2xl font-bold text-vetiver md:text-3xl">{course.title}</h1>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-foreground/60"><span>Progress</span><span>{sum.percent}%</span></div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-teal transition-all" style={{ width: `${sum.percent}%` }} /></div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
          <nav aria-label="Modules" className="order-2 space-y-4 lg:order-1">
            {sum.modules.map((m) => (
              <div key={m.key} className="rounded-xl border border-border bg-card p-3">
                <p className="mb-2 text-sm font-semibold text-vetiver">{m.title}</p>
                <ul className="space-y-1">
                  {m.lessons.map((l) => (
                    <li key={l.key}>
                      <button type="button" onClick={() => { setActiveKey(l.key); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm ${l.key === active.key ? "bg-teal/10 text-teal" : "hover:bg-muted"}`}>
                        {sum.done.has(l.key) ? <CheckCircle2 className="size-4 shrink-0 text-teal" /> : <Circle className="size-4 shrink-0 text-foreground/30" />}
                        <span className="flex-1">{l.title}</span>
                        <span className="text-foreground/40">{ICONS[l.type]}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <article className="order-1 rounded-2xl border border-border bg-card p-5 md:p-8 lg:order-2">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-foreground/50">{ICONS[active.type]} {active.type} · {active.moduleTitle}</p>
            <h2 className="mt-2 text-xl font-bold text-vetiver md:text-2xl">{active.title}</h2>

            {active.type === "video" && (
              active.videoUrl ? (
                <div className="mt-5 aspect-video overflow-hidden rounded-xl"><iframe src={active.videoUrl} title={active.title} className="h-full w-full" allowFullScreen /></div>
              ) : (
                <div className="mt-5 grid aspect-video place-items-center rounded-xl bg-muted text-center text-sm text-foreground/60">
                  <div><PlayCircle className="mx-auto mb-2 size-10" />Video coming soon</div>
                </div>
              )
            )}

            <p className="mt-5 text-base leading-relaxed text-foreground/80">{active.body}</p>

            {active.resourceKey && (() => {
              const r = RESOURCES.find((x) => x.key === active.resourceKey)!;
              return (
                <button type="button" onClick={() => downloadResource(r)} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-teal px-4 py-2 text-sm font-semibold text-teal">
                  <Download className="size-4" /> Download Resource: {r.title}
                </button>
              );
            })()}

            {active.assessmentKey && <AssessmentBox slug={slug} akey={active.assessmentKey} status={data.assess.find((a) => a.course_slug === slug && a.assessment_key === active.assessmentKey)?.status} userId={data.userId} />}

            {active.assignmentKey && (
              <AssignmentForm slug={slug} userId={data.userId} lesson={active} existing={data.subs.find((s) => s.course_slug === slug && s.assignment_key === active.assignmentKey)} />
            )}
            {active.key === "action-plan" && (
              <Link to="/academy/action-plan" search={{ course: slug }} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-ochre px-5 py-2.5 text-sm font-bold text-ink">Submit Action Plan</Link>
            )}

            <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-5">
              <button type="button" onClick={toggleComplete} disabled={busy} className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-60 ${isDone ? "border border-border" : "bg-teal text-primary-foreground"}`}>
                <CheckCircle2 className="size-4" /> {isDone ? "Completed — undo" : "Mark Lesson Complete"}
              </button>
              {next && (
                <button type="button" onClick={() => { setActiveKey(next.key); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold">
                  Next Lesson <ArrowRight className="size-4" />
                </button>
              )}
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}

function AssessmentBox({ slug, akey, status, userId }: { slug: string; akey: string; status?: string; userId: string }) {
  const a = ASSESSMENTS.find((x) => x.key === akey)!;
  const refresh = useRefreshLearner();
  async function setStatus(s: "started" | "completed") {
    const { error } = await supabase.from("lms_assessment_status").upsert(
      { user_id: userId, course_slug: slug, assessment_key: akey, status: s, updated_at: new Date().toISOString() },
      { onConflict: "user_id,course_slug,assessment_key" },
    );
    if (error) return toast.error(error.message);
    refresh();
  }
  return (
    <div className="mt-5 rounded-xl border border-border bg-muted/40 p-4">
      <p className="font-semibold text-vetiver">{a.title}</p>
      <p className="text-sm text-foreground/70">{a.purpose}</p>
      <p className="mt-1 text-xs text-foreground/60">Status: {status === "completed" ? "Completed" : status === "started" ? "Started" : "Not started"}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {a.url ? (
          <a href={a.url} target="_blank" rel="noreferrer noopener" onClick={() => status !== "completed" && setStatus("started")} className="inline-flex items-center gap-1.5 rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-primary-foreground">
            {akey === "pre-test" ? "Take Pre-Test" : akey === "post-test" ? "Take Post-Test" : "Start Assessment"} <ExternalLink className="size-3.5" />
          </a>
        ) : (
          <span className="rounded-lg bg-muted px-4 py-2 text-sm text-foreground/60">Assessment link coming soon</span>
        )}
        {status !== "completed" && <button type="button" onClick={() => setStatus("completed")} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold">I have completed it</button>}
      </div>
    </div>
  );
}

function AssignmentForm({ slug, userId, lesson, existing }: { slug: string; userId: string; lesson: Lesson & { moduleTitle: string }; existing?: { status: string; submitted_at: string; feedback: string | null } }) {
  const refresh = useRefreshLearner();
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  if (existing || done) {
    return (
      <div className="mt-5 rounded-xl border border-teal/40 bg-teal/5 p-4 text-sm">
        <p className="font-semibold text-teal">Your assignment has been submitted successfully.</p>
        {existing && <p className="mt-1 text-foreground/70">Status: {existing.status.replace("_", " ")} · {new Date(existing.submitted_at).toLocaleDateString()}</p>}
        {existing?.feedback && <p className="mt-2 text-foreground/80">Feedback: {existing.feedback}</p>}
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() && !link.trim()) return toast.error("Add a written response or a link to your work.");
    if (link && !/^https?:\/\//i.test(link)) return toast.error("Links must start with http:// or https://");
    setSending(true);
    const { error } = await supabase.from("lms_assignment_submissions").insert({
      user_id: userId, course_slug: slug, assignment_key: lesson.assignmentKey!, assignment_title: lesson.title === "Assignment" ? `${lesson.moduleTitle} — Assignment` : lesson.title,
      module_title: lesson.moduleTitle, submission_text: text.slice(0, 10000) || null, link_url: link.slice(0, 1000) || null, notes: notes.slice(0, 2000) || null,
    });
    setSending(false);
    if (error) return toast.error(`Submission failed: ${error.message}`);
    toast.success("Your assignment has been submitted successfully.");
    setDone(true);
    refresh();
  }

  return (
    <form onSubmit={submit} className="mt-5 space-y-3 rounded-xl border border-border p-4">
      <label className="block text-sm font-medium">Your response
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} className="mt-1 w-full rounded-md border border-input bg-background p-2 text-sm" />
      </label>
      <label className="block text-sm font-medium">Google Drive link or file URL (optional)
        <input value={link} onChange={(e) => setLink(e.target.value)} type="url" placeholder="https://" className="mt-1 w-full rounded-md border border-input bg-background p-2 text-sm" />
      </label>
      <label className="block text-sm font-medium">Notes or comments (optional)
        <input value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background p-2 text-sm" />
      </label>
      <button type="submit" disabled={sending} className="rounded-lg bg-ochre px-5 py-2.5 text-sm font-bold text-ink disabled:opacity-60">{sending ? "Submitting…" : "Submit Assignment"}</button>
    </form>
  );
}
