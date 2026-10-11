import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { EnrolForm } from "@/components/admin-enrol-form";
import { buildModules, learnableCourses } from "@/lib/learning-content";
import { findCourse } from "@/lib/academy-catalogue";
import { ACCESS_STATUSES, LMS_ADMIN_KEY, courseTitle, loadLmsAdmin, selectCls } from "@/lib/lms-admin";

export const Route = createFileRoute("/_authenticated/admin/participants")({
  head: () => ({ meta: [{ title: "Learners & Enrolments — LoveTech Admin" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: LMS_ADMIN_KEY });
  const { data, isLoading, error } = useQuery({ queryKey: LMS_ADMIN_KEY, queryFn: loadLmsAdmin });
  const [course, setCourse] = useState("");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  if (isLoading) return <p className="text-sm text-foreground/60">Loading…</p>;
  if (error || !data) return <p className="text-sm text-destructive">{(error as Error)?.message}</p>;

  async function update(id: string, patch: { access_status?: string; cohort_id?: string | null; cohort_name?: string | null }) {
    const { error } = await supabase.from("lms_course_starts").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Enrolment updated"); refresh();
  }
  const rows = data.starts.filter((s) => {
    const p = data.person(s.user_id);
    return (!course || s.course_slug === course) && (!q || `${p?.full_name ?? ""} ${p?.email ?? ""}`.toLowerCase().includes(q.toLowerCase()));
  });

  return (
    <div className="space-y-6">
      <EnrolForm onDone={refresh} />
      <div className="flex flex-wrap gap-2">
        <input aria-label="Search learner" placeholder="Search learner" value={q} onChange={(e) => setQ(e.target.value)} className={selectCls} />
        <select aria-label="Course" value={course} onChange={(e) => setCourse(e.target.value)} className={selectCls}><option value="">All courses</option>{learnableCourses().map((c) => <option key={c.slug} value={c.slug}>{courseTitle(c.slug)}</option>)}</select>
        <span className="self-center text-xs text-foreground/60">{rows.length} enrolments · {new Set(data.starts.map((s) => s.user_id)).size} learners</span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-foreground/60"><tr><th className="p-3">Learner</th><th className="p-3">Course</th><th className="p-3">Cohort</th><th className="p-3">Progress</th><th className="p-3">Access status</th><th className="p-3" /></tr></thead>
          <tbody>
            {rows.map((s) => {
              const p = data.person(s.user_id);
              const c = findCourse(s.course_slug);
              const total = c ? buildModules(c).reduce((n, m) => n + m.lessons.length, 0) : 0;
              const done = data.progress.filter((x) => x.user_id === s.user_id && x.course_slug === s.course_slug).length;
              const cohorts = data.cohorts.filter((x) => x.course_slug === s.course_slug);
              return [
                <tr key={s.id} className="border-t border-border">
                  <td className="p-3"><button type="button" className="text-left font-medium hover:underline" onClick={() => setOpen(open === s.id ? null : s.id)}>{p?.full_name ?? "—"}</button><div className="text-xs text-foreground/60">{p?.email}</div></td>
                  <td className="p-3 text-xs">{courseTitle(s.course_slug)}</td>
                  <td className="p-3"><select aria-label="Cohort" className={selectCls} value={s.cohort_id ?? ""} onChange={(e) => update(s.id, { cohort_id: e.target.value || null, cohort_name: cohorts.find((x) => x.id === e.target.value)?.name ?? null })}>
                    <option value="">{s.cohort_name && !s.cohort_id ? `${s.cohort_name} (text only)` : "No cohort"}</option>{cohorts.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></td>
                  <td className="p-3 text-xs">{total ? Math.round((done / total) * 100) : 0}% ({done}/{total})</td>
                  <td className="p-3"><select aria-label="Access status" className={selectCls} value={s.access_status} onChange={(e) => update(s.id, { access_status: e.target.value })}>{ACCESS_STATUSES.map((a) => <option key={a} value={a}>{a}</option>)}</select></td>
                  <td className="p-3 text-right"><button type="button" className="text-xs font-semibold text-destructive" onClick={async () => {
                    if (!confirm("Remove this enrolment completely? Use 'suspended' to keep the record.")) return;
                    const { error } = await supabase.from("lms_course_starts").delete().eq("id", s.id);
                    if (error) toast.error(error.message); else { toast.success("Enrolment removed"); refresh(); }
                  }}>Remove</button></td>
                </tr>,
                open === s.id && <tr key={`${s.id}-p`} className="bg-muted/20"><td colSpan={6} className="p-4 text-sm">
                  <div className="grid gap-2 sm:grid-cols-3">
                    <p><b>Phone:</b> {p?.phone ?? "—"}</p><p><b>Business:</b> {p?.business_name ?? "—"}</p><p><b>Location:</b> {p?.location ?? "—"}</p>
                    <p><b>Enrolled:</b> {new Date(s.started_at).toLocaleDateString()}</p>
                    <p><b>Assignments:</b> {data.subs.filter((x) => x.user_id === s.user_id && x.course_slug === s.course_slug).length}</p>
                    <p><b>Action plan:</b> {data.plans.some((x) => x.user_id === s.user_id && x.course_slug === s.course_slug) ? "Submitted" : "Not yet"}</p>
                  </div></td></tr>,
              ];
            })}
            {rows.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-foreground/60">No enrolments yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
