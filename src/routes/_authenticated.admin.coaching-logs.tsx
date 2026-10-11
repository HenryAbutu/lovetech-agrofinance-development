import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { COACHING_MODES, LMS_ADMIN_KEY, courseTitle, downloadCsv, inputCls, loadLmsAdmin } from "@/lib/lms-admin";

export const Route = createFileRoute("/_authenticated/admin/coaching-logs")({
  head: () => ({ meta: [{ title: "Coaching Logs — LoveTech Admin" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: LMS_ADMIN_KEY, queryFn: loadLmsAdmin });
  const [startId, setStartId] = useState("");
  const [f, setF] = useState({ touchpoint_number: 1, session_date: new Date().toISOString().slice(0, 10), mode: "online", notes: "", follow_up_action: "" });
  if (isLoading) return <p className="text-sm text-foreground/60">Loading…</p>;
  if (error || !data) return <p className="text-sm text-destructive">{(error as Error)?.message}</p>;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const s = data!.starts.find((x) => x.id === startId);
    if (!s) return toast.error("Choose a learner");
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("lms_coaching_logs").insert({ ...f, course_slug: s.course_slug, cohort_id: s.cohort_id, user_id: s.user_id, staff_id: u.user!.id, notes: f.notes || null, follow_up_action: f.follow_up_action || null });
    if (error) return toast.error(error.message);
    toast.success("Coaching touchpoint logged");
    setF({ ...f, notes: "", follow_up_action: "", touchpoint_number: f.touchpoint_number + 1 });
    qc.invalidateQueries({ queryKey: LMS_ADMIN_KEY });
  }
  const rows = data.coaching.map((c) => ({
    date: c.session_date, learner: data.person(c.user_id)?.full_name ?? data.person(c.user_id)?.email ?? c.user_id,
    course: courseTitle(c.course_slug), cohort: data.cohortName(c.cohort_id) ?? "", touchpoint: c.touchpoint_number, mode: c.mode,
    notes: c.notes ?? "", follow_up: c.follow_up_action ?? "", staff: data.person(c.staff_id)?.full_name ?? data.person(c.staff_id)?.email ?? "",
  }));

  return (
    <div className="space-y-6">
      <form onSubmit={save} className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
        <h2 className="text-lg font-bold sm:col-span-2 lg:col-span-4">Log a coaching touchpoint</h2>
        <label className="text-xs font-medium sm:col-span-2">Learner (course · cohort)
          <select required value={startId} onChange={(e) => setStartId(e.target.value)} className={inputCls}><option value="">Choose…</option>
            {data.starts.map((s) => { const p = data.person(s.user_id); return <option key={s.id} value={s.id}>{p?.full_name ?? p?.email ?? s.user_id} — {courseTitle(s.course_slug)}{s.cohort_id ? ` · ${data.cohortName(s.cohort_id)}` : ""}</option>; })}
          </select></label>
        <label className="text-xs font-medium">Touchpoint #<input type="number" min={1} value={f.touchpoint_number} onChange={(e) => setF({ ...f, touchpoint_number: Number(e.target.value) })} className={inputCls} /></label>
        <label className="text-xs font-medium">Date<input type="date" value={f.session_date} onChange={(e) => setF({ ...f, session_date: e.target.value })} className={inputCls} /></label>
        <label className="text-xs font-medium">Mode<select value={f.mode} onChange={(e) => setF({ ...f, mode: e.target.value })} className={inputCls}>{COACHING_MODES.map((m) => <option key={m}>{m}</option>)}</select></label>
        <label className="text-xs font-medium sm:col-span-2">Notes<textarea value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} rows={2} className={inputCls} /></label>
        <label className="text-xs font-medium">Follow-up action<input value={f.follow_up_action} onChange={(e) => setF({ ...f, follow_up_action: e.target.value })} className={inputCls} /></label>
        <div className="flex items-end"><button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Save log</button></div>
      </form>
      <div className="flex items-center justify-between"><h2 className="text-lg font-bold">Coaching logs ({rows.length})</h2>
        <button type="button" disabled={!rows.length} onClick={() => downloadCsv("coaching-logs", rows)} className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold disabled:opacity-50">Download CSV</button></div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-foreground/60"><tr>{["Date", "Learner", "Course / cohort", "#", "Mode", "Notes", "Follow-up", "Staff"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((r, i) => <tr key={i} className="border-t border-border align-top text-xs"><td className="p-3">{r.date}</td><td className="p-3">{r.learner}</td><td className="p-3">{r.course}<div className="text-foreground/60">{r.cohort}</div></td><td className="p-3">{r.touchpoint}</td><td className="p-3 capitalize">{r.mode}</td><td className="p-3 whitespace-pre-wrap">{r.notes}</td><td className="p-3">{r.follow_up}</td><td className="p-3">{r.staff}</td></tr>)}
            {rows.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-foreground/60">No coaching logged yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
