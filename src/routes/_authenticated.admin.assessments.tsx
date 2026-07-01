import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, ClipboardCheck, FileEdit, X, Check } from "lucide-react";
import {
  adminListAssessments, adminUpsertQuiz, adminDeleteQuiz,
  adminListQuizQuestions, adminUpsertQuestion, adminDeleteQuestion,
  adminUpsertAssignment, adminDeleteAssignment, adminListSubmissions,
} from "@/lib/admin-assessments.functions";
import { gradeAssignmentSubmission } from "@/lib/assessments.functions";

export const Route = createFileRoute("/_authenticated/admin/assessments")({
  head: () => ({ meta: [{ title: "Assessments · Admin" }] }),
  component: AdminAssessmentsPage,
});

function AdminAssessmentsPage() {
  const list = useServerFn(adminListAssessments);
  const [courseId, setCourseId] = useState<string>("");
  const [tab, setTab] = useState<"quizzes" | "assignments" | "grading">("quizzes");

  const { data, refetch } = useQuery({
    queryKey: ["admin-assessments", courseId],
    queryFn: () => list({ data: { course_id: courseId || undefined } }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs font-semibold uppercase tracking-widest text-vetiver">Course</label>
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm">
          <option value="">All courses</option>
          {(data?.courses ?? []).map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <div className="ml-auto flex gap-1 rounded-md border border-border p-1 text-xs">
          {(["quizzes", "assignments", "grading"] as const).map((k) => (
            <button key={k} onClick={() => setTab(k)} className={`rounded px-3 py-1.5 capitalize ${tab === k ? "bg-vetiver text-bone" : "text-foreground/70"}`}>{k}</button>
          ))}
        </div>
      </div>

      {tab === "quizzes" && <QuizzesTab courses={data?.courses ?? []} quizzes={data?.quizzes ?? []} refetch={refetch} presetCourseId={courseId} />}
      {tab === "assignments" && <AssignmentsTab courses={data?.courses ?? []} assignments={data?.assignments ?? []} refetch={refetch} presetCourseId={courseId} />}
      {tab === "grading" && <GradingTab courses={data?.courses ?? []} presetCourseId={courseId} />}
    </div>
  );
}

// ---------- QUIZZES TAB ----------
function QuizzesTab({ courses, quizzes, refetch, presetCourseId }: any) {
  const [editing, setEditing] = useState<any | null>(null);
  const [questionsFor, setQuestionsFor] = useState<any | null>(null);
  const upsert = useServerFn(adminUpsertQuiz);
  const del = useServerFn(adminDeleteQuiz);

  const save = useMutation({ mutationFn: (payload: any) => upsert({ data: payload }), onSuccess: () => { refetch(); setEditing(null); } });
  const remove = useMutation({ mutationFn: (id: string) => del({ data: { id } }), onSuccess: () => refetch() });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setEditing({ course_id: presetCourseId || courses[0]?.id, title: "", pass_score: 70, max_attempts: 3, is_published: true, sort_order: 0 })} className="inline-flex items-center gap-2 rounded-sm bg-vetiver px-4 py-2 text-sm font-semibold text-bone">
          <Plus className="size-4" /> New quiz
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-foreground/60">
            <tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Course</th><th className="px-4 py-3">Pass</th><th className="px-4 py-3">Attempts</th><th className="px-4 py-3">Published</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {quizzes.map((q: any) => (
              <tr key={q.id} className="border-t border-border">
                <td className="px-4 py-3 font-semibold text-vetiver">{q.title}</td>
                <td className="px-4 py-3">{courses.find((c: any) => c.id === q.course_id)?.title ?? "—"}</td>
                <td className="px-4 py-3">{q.pass_score}%</td>
                <td className="px-4 py-3">{q.max_attempts}</td>
                <td className="px-4 py-3">{q.is_published ? <Check className="size-4 text-vetiver" /> : <X className="size-4 text-destructive" />}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setQuestionsFor(q)} className="mr-3 text-xs text-vetiver underline">Questions</button>
                  <button onClick={() => setEditing(q)} className="mr-2 inline-flex items-center gap-1 text-xs"><Pencil className="size-3" /> Edit</button>
                  <button onClick={() => confirm("Delete quiz?") && remove.mutate(q.id)} className="text-xs text-destructive"><Trash2 className="inline size-3" /></button>
                </td>
              </tr>
            ))}
            {quizzes.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-foreground/60"><ClipboardCheck className="mx-auto mb-2 size-6 opacity-40" /> No quizzes yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && <QuizForm courses={courses} initial={editing} onCancel={() => setEditing(null)} onSave={(p: any) => save.mutate(p: any)} saving={save.isPending} />}
      {questionsFor && <QuestionsManager quiz={questionsFor} onClose={() => setQuestionsFor(null)} />}
    </div>
  );
}

function QuizForm({ courses, initial, onCancel, onSave, saving }: any) {
  const [form, setForm] = useState<any>(initial);
  return (
    <Modal title={form.id ? "Edit quiz" : "New quiz"} onClose={onCancel}>
      <div className="space-y-3">
        <Field label="Course">
          <select value={form.course_id ?? ""} onChange={(e) => setForm({ ...form, course_id: e.target.value })} className="input">
            {courses.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </Field>
        <Field label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" /></Field>
        <Field label="Description"><textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" rows={3} /></Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Pass score %"><input type="number" min={0} max={100} value={form.pass_score} onChange={(e) => setForm({ ...form, pass_score: Number(e.target.value) })} className="input" /></Field>
          <Field label="Max attempts"><input type="number" min={1} max={20} value={form.max_attempts} onChange={(e) => setForm({ ...form, max_attempts: Number(e.target.value) })} className="input" /></Field>
          <Field label="Sort order"><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="input" /></Field>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} /> Published</label>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onCancel} className="rounded-sm border border-border px-4 py-2 text-sm">Cancel</button>
        <button onClick={() => onSave(form)} disabled={saving || !form.course_id || !form.title} className="rounded-sm bg-vetiver px-4 py-2 text-sm font-semibold text-bone disabled:opacity-50">{saving ? "Saving…" : "Save"}</button>
      </div>
    </Modal>
  );
}

// ---------- QUESTIONS MANAGER ----------
function QuestionsManager({ quiz, onClose }: { quiz: any; onClose: () => void }) {
  const qc = useQueryClient();
  const list = useServerFn(adminListQuizQuestions);
  const upsert = useServerFn(adminUpsertQuestion);
  const del = useServerFn(adminDeleteQuestion);
  const { data } = useQuery({ queryKey: ["quiz-questions", quiz.id], queryFn: () => list({ data: { quiz_id: quiz.id } }) });

  const save = useMutation({ mutationFn: (payload: any) => upsert({ data: payload }), onSuccess: () => qc.invalidateQueries({ queryKey: ["quiz-questions", quiz.id] }) });
  const remove = useMutation({ mutationFn: (id: string) => del({ data: { id } }), onSuccess: () => qc.invalidateQueries({ queryKey: ["quiz-questions", quiz.id] }) });

  const [editing, setEditing] = useState<any | null>(null);

  return (
    <Modal title={`Questions — ${quiz.title}`} onClose={onClose} wide>
      <div className="mb-3 flex justify-end">
        <button onClick={() => setEditing({ quiz_id: quiz.id, prompt: "", question_type: "single_choice", options: [{ id: "a", text: "" }, { id: "b", text: "" }], correct_option_ids: [], points: 1, sort_order: (data?.questions?.length ?? 0) })} className="inline-flex items-center gap-2 rounded-sm bg-vetiver px-3 py-1.5 text-xs font-semibold text-bone">
          <Plus className="size-3" /> Add question
        </button>
      </div>
      <ol className="space-y-2">
        {(data?.questions ?? []).map((q: any, i: number) => (
          <li key={q.id} className="rounded-md border border-border p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-vetiver">Q{i + 1}. {q.prompt}</p>
                <ul className="mt-1 text-xs text-foreground/70">
                  {(q.options ?? []).map((o: any) => (
                    <li key={o.id} className={q.correct_option_ids?.includes(o.id) ? "text-vetiver" : ""}>
                      {q.correct_option_ids?.includes(o.id) ? "✓" : "·"} {o.text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2 text-xs">
                <button onClick={() => setEditing(q)} className="text-vetiver"><Pencil className="size-3 inline" /></button>
                <button onClick={() => confirm("Delete question?") && remove.mutate(q.id)} className="text-destructive"><Trash2 className="size-3 inline" /></button>
              </div>
            </div>
          </li>
        ))}
        {(data?.questions ?? []).length === 0 && <p className="text-center text-sm text-foreground/60">No questions yet.</p>}
      </ol>

      {editing && <QuestionForm initial={editing} onCancel={() => setEditing(null)} onSave={(p: any) => save.mutate(p, { onSuccess: () => setEditing(null) })} saving={save.isPending} />}
    </Modal>
  );
}

function QuestionForm({ initial, onCancel, onSave, saving }: any) {
  const [form, setForm] = useState<any>(initial);
  const setOpt = (idx: number, patch: any) => {
    const opts = [...form.options];
    opts[idx] = { ...opts[idx], ...patch };
    setForm({ ...form, options: opts });
  };
  const addOpt = () => setForm({ ...form, options: [...form.options, { id: String.fromCharCode(97 + form.options.length), text: "" }] });
  const removeOpt = (idx: number) => setForm({ ...form, options: form.options.filter((_: any, i: number) => i !== idx), correct_option_ids: form.correct_option_ids.filter((id: string) => id !== form.options[idx].id) });
  const toggleCorrect = (id: string) => {
    if (form.question_type === "multi_choice") {
      setForm({ ...form, correct_option_ids: form.correct_option_ids.includes(id) ? form.correct_option_ids.filter((x: string) => x !== id) : [...form.correct_option_ids, id] });
    } else {
      setForm({ ...form, correct_option_ids: [id] });
    }
  };
  return (
    <Modal title={form.id ? "Edit question" : "Add question"} onClose={onCancel}>
      <div className="space-y-3">
        <Field label="Prompt"><textarea value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} className="input" rows={2} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type">
            <select value={form.question_type} onChange={(e) => setForm({ ...form, question_type: e.target.value })} className="input">
              <option value="single_choice">Single choice</option>
              <option value="multi_choice">Multiple choice</option>
              <option value="true_false">True / False</option>
            </select>
          </Field>
          <Field label="Points"><input type="number" min={1} value={form.points} onChange={(e) => setForm({ ...form, points: Number(e.target.value) })} className="input" /></Field>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-vetiver">Options (tick correct)</label>
          <div className="space-y-1">
            {form.options.map((o: any, idx: number) => (
              <div key={o.id} className="flex items-center gap-2">
                <input type={form.question_type === "multi_choice" ? "checkbox" : "radio"} checked={form.correct_option_ids.includes(o.id)} onChange={() => toggleCorrect(o.id)} />
                <input value={o.text} onChange={(e) => setOpt(idx, { text: e.target.value })} placeholder={`Option ${o.id.toUpperCase()}`} className="input flex-1" />
                {form.options.length > 2 && <button onClick={() => removeOpt(idx)} className="text-destructive"><X className="size-4" /></button>}
              </div>
            ))}
          </div>
          {form.options.length < 6 && <button onClick={addOpt} className="mt-2 text-xs text-vetiver underline">+ Add option</button>}
        </div>
        <Field label="Explanation (optional)"><textarea value={form.explanation ?? ""} onChange={(e) => setForm({ ...form, explanation: e.target.value })} className="input" rows={2} /></Field>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onCancel} className="rounded-sm border border-border px-4 py-2 text-sm">Cancel</button>
        <button
          onClick={() => onSave({ ...form, options: form.options.filter((o: any) => o.text.trim()) })}
          disabled={saving || !form.prompt.trim() || form.correct_option_ids.length === 0}
          className="rounded-sm bg-vetiver px-4 py-2 text-sm font-semibold text-bone disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </Modal>
  );
}

// ---------- ASSIGNMENTS TAB ----------
function AssignmentsTab({ courses, assignments, refetch, presetCourseId }: any) {
  const [editing, setEditing] = useState<any | null>(null);
  const upsert = useServerFn(adminUpsertAssignment);
  const del = useServerFn(adminDeleteAssignment);
  const save = useMutation({ mutationFn: (p: any) => upsert({ data: p }), onSuccess: () => { refetch(); setEditing(null); } });
  const remove = useMutation({ mutationFn: (id: string) => del({ data: { id } }), onSuccess: () => refetch() });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setEditing({ course_id: presetCourseId || courses[0]?.id, title: "", instructions: "", submission_type: "text", max_points: 100, is_published: true, sort_order: 0 })} className="inline-flex items-center gap-2 rounded-sm bg-vetiver px-4 py-2 text-sm font-semibold text-bone">
          <Plus className="size-4" /> New assignment
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-foreground/60">
            <tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Course</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Max</th><th className="px-4 py-3">Published</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {assignments.map((a: any) => (
              <tr key={a.id} className="border-t border-border">
                <td className="px-4 py-3 font-semibold text-vetiver">{a.title}</td>
                <td className="px-4 py-3">{courses.find((c: any) => c.id === a.course_id)?.title ?? "—"}</td>
                <td className="px-4 py-3 capitalize">{a.submission_type}</td>
                <td className="px-4 py-3">{a.max_points}</td>
                <td className="px-4 py-3">{a.is_published ? <Check className="size-4 text-vetiver" /> : <X className="size-4 text-destructive" />}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(a)} className="mr-2 text-xs"><Pencil className="inline size-3" /></button>
                  <button onClick={() => confirm("Delete assignment?") && remove.mutate(a.id)} className="text-xs text-destructive"><Trash2 className="inline size-3" /></button>
                </td>
              </tr>
            ))}
            {assignments.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-foreground/60"><FileEdit className="mx-auto mb-2 size-6 opacity-40" /> No assignments yet.</td></tr>}
          </tbody>
        </table>
      </div>
      {editing && (
        <Modal title={editing.id ? "Edit assignment" : "New assignment"} onClose={() => setEditing(null)}>
          <div className="space-y-3">
            <Field label="Course">
              <select value={editing.course_id ?? ""} onChange={(e) => setEditing({ ...editing, course_id: e.target.value })} className="input">
                {courses.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </Field>
            <Field label="Title"><input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="input" /></Field>
            <Field label="Instructions"><textarea value={editing.instructions} onChange={(e) => setEditing({ ...editing, instructions: e.target.value })} className="input" rows={5} /></Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Submission">
                <select value={editing.submission_type} onChange={(e) => setEditing({ ...editing, submission_type: e.target.value })} className="input">
                  <option value="text">Text</option><option value="url">URL</option><option value="both">Both</option>
                </select>
              </Field>
              <Field label="Max points"><input type="number" min={1} value={editing.max_points} onChange={(e) => setEditing({ ...editing, max_points: Number(e.target.value) })} className="input" /></Field>
              <Field label="Sort order"><input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className="input" /></Field>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.is_published} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} /> Published</label>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button onClick={() => setEditing(null)} className="rounded-sm border border-border px-4 py-2 text-sm">Cancel</button>
            <button onClick={() => save.mutate(editing)} disabled={save.isPending || !editing.course_id || !editing.title || !editing.instructions} className="rounded-sm bg-vetiver px-4 py-2 text-sm font-semibold text-bone disabled:opacity-50">{save.isPending ? "Saving…" : "Save"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ---------- GRADING TAB ----------
function GradingTab({ courses, presetCourseId }: any) {
  const list = useServerFn(adminListSubmissions);
  const grade = useServerFn(gradeAssignmentSubmission);
  const qc = useQueryClient();
  const [status, setStatus] = useState<"submitted" | "graded" | "">("submitted");
  const { data, refetch } = useQuery({
    queryKey: ["admin-submissions", presetCourseId, status],
    queryFn: () => list({ data: { course_id: presetCourseId || undefined, status: (status || undefined) as any } }),
  });
  const [grading, setGrading] = useState<any | null>(null);
  const save = useMutation({
    mutationFn: (p: { submission_id: string; score: number; feedback?: string }) => grade({ data: p }),
    onSuccess: () => { refetch(); setGrading(null); qc.invalidateQueries({ queryKey: ["admin-submissions"] }); },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs font-semibold uppercase tracking-widest text-vetiver">Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="rounded-md border border-border bg-background px-3 py-2 text-sm">
          <option value="submitted">Pending</option>
          <option value="graded">Graded</option>
          <option value="">All</option>
        </select>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-foreground/60">
            <tr><th className="px-4 py-3">Learner</th><th className="px-4 py-3">Assignment</th><th className="px-4 py-3">Submitted</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Score</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {(data?.submissions ?? []).map((s: any) => (
              <tr key={s.id} className="border-t border-border">
                <td className="px-4 py-3">{s.learner?.full_name ?? s.learner?.email ?? "Learner"}</td>
                <td className="px-4 py-3">{s.assignment?.title ?? "—"}</td>
                <td className="px-4 py-3 text-xs text-foreground/60">{new Date(s.submitted_at).toLocaleString()}</td>
                <td className="px-4 py-3 capitalize">{s.status}</td>
                <td className="px-4 py-3">{s.score != null ? `${s.score}/${s.assignment?.max_points ?? "—"}` : "—"}</td>
                <td className="px-4 py-3 text-right"><button onClick={() => setGrading(s)} className="text-xs text-vetiver underline">View</button></td>
              </tr>
            ))}
            {(data?.submissions ?? []).length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-foreground/60">No submissions.</td></tr>}
          </tbody>
        </table>
      </div>

      {grading && (
        <Modal title={`Grade — ${grading.assignment?.title ?? ""}`} onClose={() => setGrading(null)} wide>
          <p className="mb-2 text-xs text-foreground/60">Learner: {grading.learner?.full_name ?? grading.learner?.email}</p>
          {grading.submission_text && (
            <div className="mb-3">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-vetiver">Text submission</label>
              <pre className="max-h-[300px] overflow-auto whitespace-pre-wrap rounded-md border border-border bg-muted/30 p-3 text-sm">{grading.submission_text}</pre>
            </div>
          )}
          {grading.submission_url && (
            <div className="mb-3">
              <a href={grading.submission_url} target="_blank" rel="noopener noreferrer" className="text-sm text-vetiver underline">Open link submission →</a>
            </div>
          )}
          <GradeForm initial={grading} maxPoints={grading.assignment?.max_points ?? 100} onSave={(p: any) => save.mutate(p: any)} saving={save.isPending} />
        </Modal>
      )}
    </div>
  );
}

function GradeForm({ initial, maxPoints, onSave, saving }: any) {
  const [score, setScore] = useState<number>(initial.score ?? 0);
  const [feedback, setFeedback] = useState<string>(initial.feedback ?? "");
  return (
    <div className="space-y-3">
      <Field label={`Score (out of ${maxPoints})`}>
        <input type="number" min={0} max={maxPoints} value={score} onChange={(e) => setScore(Number(e.target.value))} className="input" />
      </Field>
      <Field label="Feedback">
        <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4} className="input" />
      </Field>
      <div className="flex justify-end">
        <button onClick={() => onSave({ submission_id: initial.id, score, feedback: feedback || undefined })} disabled={saving} className="rounded-sm bg-vetiver px-4 py-2 text-sm font-semibold text-bone disabled:opacity-50">{saving ? "Saving…" : "Save grade"}</button>
      </div>
    </div>
  );
}

// ---------- Shared UI ----------
function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div className={`max-h-[90vh] w-full ${wide ? "max-w-3xl" : "max-w-lg"} overflow-y-auto rounded-2xl bg-card p-6 shadow-xl`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-lg text-vetiver">{title}</h3>
          <button onClick={onClose} className="text-foreground/60"><X className="size-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-vetiver">{label}</span>
      {children}
    </label>
  );
}

// Small utility class hoisted via style tag (once)
if (typeof document !== "undefined" && !document.getElementById("admin-input-style")) {
  const s = document.createElement("style");
  s.id = "admin-input-style";
  s.textContent = `.input{width:100%;border-radius:6px;border:1px solid hsl(var(--border));background:hsl(var(--background));padding:8px 10px;font-size:14px}`;
  document.head.appendChild(s);
}
