import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { learnableCourses } from "@/lib/learning-content";
import { LMS_ADMIN_KEY, courseTitle, inputCls, label, loadLmsAdmin, selectCls } from "@/lib/lms-admin";

export const Route = createFileRoute("/_authenticated/admin/cohorts")({
  head: () => ({ meta: [{ title: "Cohorts — LoveTech Admin" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

const blank = { course_slug: learnableCourses()[0].slug, name: "", location: "", start_date: "", end_date: "", delivery_mode: "Hybrid", facilitator_id: "", status: "planned" };

function Page() {
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: LMS_ADMIN_KEY });
  const { data, isLoading, error } = useQuery({ queryKey: LMS_ADMIN_KEY, queryFn: loadLmsAdmin });
  const staff = useQuery({ queryKey: ["lms-staff-list"], queryFn: async () => (await supabase.rpc("admin_list_users")).data ?? [], retry: false });
  const [f, setF] = useState(blank);
  const [open, setOpen] = useState<string | null>(null);
  if (isLoading) return <p className="text-sm text-foreground/60">Loading…</p>;
  if (error || !data) return <p className="text-sm text-destructive">{(error as Error)?.message}</p>;
  const facilitators = (staff.data ?? []).filter((u: any) => u.role !== "learner");

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("lms_cohorts").insert({ ...f, location: f.location || null, start_date: f.start_date || null, end_date: f.end_date || null, facilitator_id: f.facilitator_id || null });
    if (error) return toast.error(error.message);
    toast.success("Cohort created"); setF(blank); refresh();
  }
  async function assign(startId: string, cohortId: string) {
    const c = data!.cohorts.find((x) => x.id === cohortId);
    const { error } = await supabase.from("lms_course_starts").update({ cohort_id: cohortId || null, cohort_name: c?.name ?? null }).eq("id", startId);
    if (error) return toast.error(error.message);
    toast.success(cohortId ? "Learner assigned" : "Learner removed from cohort"); refresh();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={create} className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
        <h2 className="text-lg font-bold sm:col-span-2 lg:col-span-4">Create a cohort</h2>
        <label className="text-xs font-medium">Course<select value={f.course_slug} onChange={(e) => setF({ ...f, course_slug: e.target.value })} className={inputCls}>{learnableCourses().map((c) => <option key={c.slug} value={c.slug}>{courseTitle(c.slug)}</option>)}</select></label>
        <label className="text-xs font-medium">Cohort name<input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="e.g. Abuja Cohort 1" className={inputCls} /></label>
        <label className="text-xs font-medium">Location<input value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} className={inputCls} /></label>
        <label className="text-xs font-medium">Delivery mode<select value={f.delivery_mode} onChange={(e) => setF({ ...f, delivery_mode: e.target.value })} className={inputCls}>{["Online", "In-person", "Hybrid"].map((m) => <option key={m}>{m}</option>)}</select></label>
        <label className="text-xs font-medium">Start date<input type="date" value={f.start_date} onChange={(e) => setF({ ...f, start_date: e.target.value })} className={inputCls} /></label>
        <label className="text-xs font-medium">End date<input type="date" value={f.end_date} onChange={(e) => setF({ ...f, end_date: e.target.value })} className={inputCls} /></label>
        <label className="text-xs font-medium">Facilitator<select value={f.facilitator_id} onChange={(e) => setF({ ...f, facilitator_id: e.target.value })} className={inputCls}><option value="">Not assigned</option>{facilitators.map((u: any) => <option key={u.id} value={u.id}>{u.full_name || u.email} ({u.role})</option>)}</select></label>
        <div className="flex items-end"><button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Create cohort</button></div>
      </form>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Cohorts ({data.cohorts.length})</h2>
        {data.cohorts.length === 0 && <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-foreground/60">No cohorts yet.</p>}
        {data.cohorts.map((c) => {
          const members = data.starts.filter((s) => s.cohort_id === c.id);
          const unassigned = data.starts.filter((s) => s.course_slug === c.course_slug && s.cohort_id !== c.id);
          const fac = (staff.data ?? []).find((u: any) => u.id === c.facilitator_id);
          return (
            <div key={c.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{c.name} <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs capitalize">{label(c.status)}</span></p>
                  <p className="text-xs text-foreground/60">{courseTitle(c.course_slug)} · {c.delivery_mode ?? "—"} · {c.location ?? "No location"} · {c.start_date ?? "?"} → {c.end_date ?? "?"} · Facilitator: {fac ? (fac.full_name || fac.email) : c.facilitator_id ? "Assigned" : "Not assigned"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select aria-label="Cohort status" value={c.status} className={selectCls} onChange={async (e) => { const { error } = await supabase.from("lms_cohorts").update({ status: e.target.value }).eq("id", c.id); if (error) toast.error(error.message); else refresh(); }}>
                    {["planned", "active", "completed", "cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button type="button" className="text-xs font-semibold text-primary" onClick={() => setOpen(open === c.id ? null : c.id)}>{open === c.id ? "Hide" : `Participants (${members.length})`}</button>
                </div>
              </div>
              {open === c.id && (
                <div className="mt-4 space-y-3">
                  <ul className="divide-y divide-border rounded-lg border border-border">
                    {members.map((s) => { const p = data.person(s.user_id); return (
                      <li key={s.id} className="flex items-center justify-between p-2 text-sm"><span>{p?.full_name ?? "—"} <span className="text-xs text-foreground/60">{p?.email} · {s.access_status}</span></span>
                        <button type="button" className="text-xs text-destructive" onClick={() => assign(s.id, "")}>Remove</button></li>); })}
                    {members.length === 0 && <li className="p-3 text-center text-xs text-foreground/60">No participants yet.</li>}
                  </ul>
                  {unassigned.length > 0 && (
                    <select aria-label="Add enrolled learner" className={selectCls} value="" onChange={(e) => e.target.value && assign(e.target.value, c.id)}>
                      <option value="">+ Add an enrolled learner…</option>
                      {unassigned.map((s) => { const p = data.person(s.user_id); return <option key={s.id} value={s.id}>{p?.full_name ?? p?.email ?? s.user_id}</option>; })}
                    </select>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
