import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { learnableCourses } from "@/lib/learning-content";
import { REVIEW_STATUSES, courseTitle, label, selectCls, type LmsAdminData } from "@/lib/lms-admin";

type Item = { id: string; user_id: string; course_slug: string; status: string; feedback: string | null; title: string; date: string; body: { k: string; v: string | null | undefined }[]; link?: string | null };

/** Shared review list for assignment submissions and action plans. */
export function ReviewTable({ data, items, table, onDone }: { data: LmsAdminData; items: Item[]; table: "lms_assignment_submissions" | "lms_action_plans"; onDone: () => void }) {
  const [course, setCourse] = useState("");
  const [cohort, setCohort] = useState("");
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const rows = items.filter((i) => {
    const p = data.person(i.user_id);
    const st = data.cohortOf(i.user_id, i.course_slug);
    return (!course || i.course_slug === course) && (!status || i.status === status) && (!cohort || st?.cohort_id === cohort)
      && (!q || `${p?.full_name ?? ""} ${p?.email ?? ""}`.toLowerCase().includes(q.toLowerCase()));
  });
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <input aria-label="Search learner" placeholder="Search learner" value={q} onChange={(e) => setQ(e.target.value)} className={selectCls} />
        <select aria-label="Course" value={course} onChange={(e) => setCourse(e.target.value)} className={selectCls}><option value="">All courses</option>{learnableCourses().map((c) => <option key={c.slug} value={c.slug}>{courseTitle(c.slug)}</option>)}</select>
        <select aria-label="Cohort" value={cohort} onChange={(e) => setCohort(e.target.value)} className={selectCls}><option value="">All cohorts</option>{data.cohorts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}><option value="">All statuses</option>{REVIEW_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}</select>
        <span className="self-center text-xs text-foreground/60">{rows.length} shown</span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-foreground/60"><tr><th className="p-3">Learner</th><th className="p-3">Course / cohort</th><th className="p-3">Item</th><th className="p-3">Submitted</th><th className="p-3">Status</th><th className="p-3" /></tr></thead>
          <tbody>
            {rows.map((i) => {
              const p = data.person(i.user_id);
              const st = data.cohortOf(i.user_id, i.course_slug);
              return [
                <tr key={i.id} className="border-t border-border align-top">
                  <td className="p-3">{p?.full_name ?? "—"}<div className="text-xs text-foreground/60">{p?.email}</div></td>
                  <td className="p-3 text-xs">{courseTitle(i.course_slug)}<div className="text-foreground/60">{data.cohortName(st?.cohort_id) ?? st?.cohort_name ?? "No cohort"}</div></td>
                  <td className="p-3 text-xs">{i.title}</td>
                  <td className="p-3 text-xs">{new Date(i.date).toLocaleDateString()}</td>
                  <td className="p-3"><span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold capitalize">{label(i.status)}</span></td>
                  <td className="p-3 text-right"><button type="button" className="text-xs font-semibold text-primary" onClick={() => setOpen(open === i.id ? null : i.id)}>{open === i.id ? "Close" : "Open / review"}</button></td>
                </tr>,
                open === i.id && <tr key={`${i.id}-r`} className="border-t border-border bg-muted/20"><td colSpan={6} className="p-4"><Review item={i} table={table} onDone={() => { setOpen(null); onDone(); }} /></td></tr>,
              ];
            })}
            {rows.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-foreground/60">Nothing to review yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Review({ item, table, onDone }: { item: Item; table: "lms_assignment_submissions" | "lms_action_plans"; onDone: () => void }) {
  const [status, setStatus] = useState(item.status);
  const [feedback, setFeedback] = useState(item.feedback ?? "");
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from(table).update({ status, feedback: feedback || null, reviewed_by: u.user?.id, reviewed_at: new Date().toISOString() }).eq("id", item.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Review saved");
    onDone();
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <dl className="space-y-2 text-sm">
        {item.body.filter((b) => b.v).map((b) => <div key={b.k}><dt className="text-xs font-semibold uppercase text-foreground/60">{b.k}</dt><dd className="whitespace-pre-wrap">{b.v}</dd></div>)}
        {item.link && <a href={item.link} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary underline">Open submitted link / file</a>}
      </dl>
      <div className="space-y-2">
        <label className="block text-xs font-medium">Status
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${selectCls} mt-1 block`}>{REVIEW_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}</select>
        </label>
        <label className="block text-xs font-medium">Reviewer comments
          <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border border-input bg-background p-2 text-sm" />
        </label>
        <button type="button" disabled={busy} onClick={save} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Saving…" : "Save review"}</button>
      </div>
    </div>
  );
}
