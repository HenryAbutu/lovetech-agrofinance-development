import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { findCourse } from "@/lib/academy-catalogue";
import { buildModules } from "@/lib/learning-content";
import { LMS_ADMIN_KEY, courseTitle, downloadCsv, label, loadLmsAdmin, selectCls, type LmsAdminData } from "@/lib/lms-admin";

export const Route = createFileRoute("/_authenticated/admin/evidence-export")({
  head: () => ({ meta: [{ title: "Attendance & Evidence — LoveTech Admin" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

/** One row per enrolment summarising all evidence for reporting. */
function evidenceRows(d: LmsAdminData) {
  return d.starts.map((s) => {
    const p = d.person(s.user_id);
    const c = findCourse(s.course_slug);
    const total = c ? buildModules(c).reduce((n, m) => n + m.lessons.length, 0) : 0;
    const done = d.progress.filter((x) => x.user_id === s.user_id && x.course_slug === s.course_slug).length;
    const st = (k: string) => d.assess.find((a) => a.user_id === s.user_id && a.course_slug === s.course_slug && a.assessment_key === k)?.status ?? "not_started";
    const att = d.attendance.filter((a) => a.user_id === s.user_id && a.cohort_id === s.cohort_id);
    const plan = d.plans.find((x) => x.user_id === s.user_id && x.course_slug === s.course_slug);
    const progress = total ? Math.round((done / total) * 100) : 0;
    return {
      learner: p?.full_name ?? "", email: p?.email ?? "", course: courseTitle(s.course_slug), cohort: d.cohortName(s.cohort_id) ?? s.cohort_name ?? "",
      access_status: s.access_status, progress_percent: progress,
      sessions_attended: `${att.filter((a) => a.present).length}/${att.length}`,
      coaching_touchpoints: d.coaching.filter((x) => x.user_id === s.user_id && x.course_slug === s.course_slug).length,
      assignments_submitted: d.subs.filter((x) => x.user_id === s.user_id && x.course_slug === s.course_slug).length,
      action_plan: plan ? label(plan.status) : "not submitted",
      pre_test: label(st("pre-test")), post_test: label(st("post-test")), feedback_form: label(st("feedback")),
      completion_evidence: progress === 100 && plan && st("post-test") === "completed" ? "complete" : "incomplete",
    };
  });
}

function Page() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: LMS_ADMIN_KEY, queryFn: loadLmsAdmin });
  const [cohort, setCohort] = useState("");
  const [session, setSession] = useState({ label: "Session 1", date: new Date().toISOString().slice(0, 10) });
  if (isLoading) return <p className="text-sm text-foreground/60">Loading…</p>;
  if (error || !data) return <p className="text-sm text-destructive">{(error as Error)?.message}</p>;

  const rows = evidenceRows(data);
  const members = data.starts.filter((s) => s.cohort_id === cohort);
  async function mark(uid: string, present: boolean) {
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("lms_attendance").upsert(
      { cohort_id: cohort, user_id: uid, session_label: session.label, session_date: session.date, present, recorded_by: u.user?.id },
      { onConflict: "cohort_id,user_id,session_label" });
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: LMS_ADMIN_KEY });
  }
  const conversion = data.waitlist.length ? Math.round((data.waitlist.filter((w) => w.status === "enrolled").length / data.waitlist.length) * 100) : 0;
  const exports: [string, () => Record<string, unknown>[]][] = [
    ["Learner progress & evidence", () => rows],
    ["Attendance", () => data.attendance.map((a) => ({ cohort: data.cohortName(a.cohort_id), session: a.session_label, date: a.session_date, learner: data.person(a.user_id)?.full_name ?? data.person(a.user_id)?.email, present: a.present ? "yes" : "no" }))],
    ["Assignment submissions", () => data.subs.map((s) => ({ learner: data.person(s.user_id)?.full_name ?? data.person(s.user_id)?.email, course: courseTitle(s.course_slug), assignment: s.assignment_title, status: s.status, submitted: s.submitted_at, link: s.link_url ?? "", feedback: s.feedback ?? "" }))],
    ["Action plans", () => data.plans.map((p) => ({ learner: data.person(p.user_id)?.full_name ?? data.person(p.user_id)?.email, course: courseTitle(p.course_slug), type: p.plan_type, goal: p.main_goal, status: p.status, submitted: p.created_at, feedback: p.feedback ?? "" }))],
    ["Coaching logs", () => data.coaching.map((c) => ({ date: c.session_date, learner: data.person(c.user_id)?.full_name ?? data.person(c.user_id)?.email, course: courseTitle(c.course_slug), touchpoint: c.touchpoint_number, mode: c.mode, notes: c.notes ?? "", follow_up: c.follow_up_action ?? "" }))],
    ["Waitlist conversion", () => data.waitlist.map((w) => ({ course: w.course_interest ?? w.interest_area ?? "", status: w.status, joined: w.created_at }))],
  ];

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Reports & CSV exports</h2>
        <p className="text-xs text-foreground/60">Waitlist → enrolment conversion: {conversion}% · Completion evidence: {rows.filter((r) => r.completion_evidence === "complete").length}/{rows.length} enrolments</p>
        <div className="flex flex-wrap gap-2">
          {exports.map(([name, fn]) => <button key={name} type="button" onClick={() => { const r = fn(); if (!r.length) toast.info("Nothing to export yet"); else downloadCsv(name.toLowerCase().replace(/[^a-z]+/g, "-"), r); }} className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold">Download {name}</button>)}
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-card p-4">
        <h2 className="text-lg font-bold">Attendance register</h2>
        <div className="flex flex-wrap gap-2">
          <select aria-label="Cohort" value={cohort} onChange={(e) => setCohort(e.target.value)} className={selectCls}><option value="">Choose a cohort…</option>{data.cohorts.map((c) => <option key={c.id} value={c.id}>{c.name} — {courseTitle(c.course_slug)}</option>)}</select>
          <input aria-label="Session name" value={session.label} onChange={(e) => setSession({ ...session, label: e.target.value })} className={selectCls} />
          <input aria-label="Session date" type="date" value={session.date} onChange={(e) => setSession({ ...session, date: e.target.value })} className={selectCls} />
        </div>
        {cohort && (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {members.map((s) => {
              const rec = data.attendance.find((a) => a.cohort_id === cohort && a.user_id === s.user_id && a.session_label === session.label);
              const p = data.person(s.user_id);
              return <li key={s.id} className="flex items-center justify-between p-2 text-sm"><span>{p?.full_name ?? p?.email}</span>
                <span className="flex gap-2">
                  <button type="button" onClick={() => mark(s.user_id, true)} className={`rounded px-2 py-1 text-xs ${rec?.present ? "bg-primary text-primary-foreground" : "border border-border"}`}>Present</button>
                  <button type="button" onClick={() => mark(s.user_id, false)} className={`rounded px-2 py-1 text-xs ${rec && !rec.present ? "bg-destructive text-destructive-foreground" : "border border-border"}`}>Absent</button>
                </span></li>;
            })}
            {members.length === 0 && <li className="p-3 text-center text-xs text-foreground/60">No learners assigned to this cohort yet.</li>}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Evidence by learner</h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[1100px] text-xs">
            <thead className="bg-muted/50 text-left uppercase text-foreground/60"><tr>{["Learner", "Course / cohort", "Access", "Progress", "Attendance", "Coaching", "Assignments", "Action plan", "Pre-test", "Post-test", "Completion"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((r, i) => <tr key={i} className="border-t border-border"><td className="p-3">{r.learner || r.email}</td><td className="p-3">{r.course}<div className="text-foreground/60">{r.cohort}</div></td><td className="p-3">{r.access_status}</td><td className="p-3">{r.progress_percent}%</td><td className="p-3">{r.sessions_attended}</td><td className="p-3">{r.coaching_touchpoints}</td><td className="p-3">{r.assignments_submitted}</td><td className="p-3 capitalize">{r.action_plan}</td><td className="p-3 capitalize">{r.pre_test}</td><td className="p-3 capitalize">{r.post_test}</td><td className="p-3 capitalize">{r.completion_evidence}</td></tr>)}
              {rows.length === 0 && <tr><td colSpan={11} className="p-6 text-center text-foreground/60">No enrolments yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
