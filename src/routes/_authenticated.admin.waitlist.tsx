import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { EnrolForm } from "@/components/admin-enrol-form";
import { listWaitlistAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/waitlist")({
  component: WaitlistAdmin,
});

function WaitlistAdmin() {
  const list = useServerFn(listWaitlistAdmin);
  const { data, isLoading, error } = useQuery({ queryKey: ["admin-waitlist"], queryFn: () => list() });
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-waitlist"] });
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [course, setCourse] = useState("");
  const [statusF, setStatusF] = useState("");
  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("academy_waitlist").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Marked as ${status}`); refresh();
  }

  const progName = (w: any) => { const c = Array.isArray(w.course) ? w.course[0] : w.course; return c?.title ?? w.course_interest ?? w.interest_area ?? "General"; };
  const courseOptions = [...new Set((data?.waitlist ?? []).map(progName))].sort();
  const rows = (data?.waitlist ?? []).filter((w: any) => (!course || progName(w) === course) && (!statusF || w.status === statusF));
  if (isLoading) return <p className="text-sm text-foreground/60">Loading…</p>;
  if (error) return <p className="text-sm text-destructive">Could not load waitlist: {(error as Error).message}</p>;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <select aria-label="Filter by course" value={course} onChange={(e) => setCourse(e.target.value)} className="rounded-md border border-input bg-background p-2 text-sm">
          <option value="">All courses</option>
          {courseOptions.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select aria-label="Filter by status" value={statusF} onChange={(e) => setStatusF(e.target.value)} className="rounded-md border border-input bg-background p-2 text-sm">
          <option value="">All statuses</option>
          {["new", "contacted", "approved", "enrolled"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <p className="text-sm text-foreground/60">{rows.length} of {data?.waitlist.length ?? 0} people on the waitlist</p>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-widest text-foreground/60">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Business</th>
              <th className="p-3">Programme</th>
              <th className="p-3">Mode / Challenge</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status / Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((w: any) => {
              const course = Array.isArray(w.course) ? w.course[0] : w.course;
              return (
                <tr key={w.id} className="border-t border-border align-top">
                  <td className="p-3 font-medium">{w.full_name}</td>
                  <td className="p-3">
                    <div className="text-xs">{w.email}</div>
                    {w.phone && <div className="text-xs text-foreground/60">{w.phone}</div>}
                  </td>
                  <td className="p-3 text-xs">
                    {w.business_name ?? "—"}
                    {w.business_sector && <div className="text-foreground/60">{w.business_sector}</div>}
                    {w.location && <div className="text-foreground/60">{w.location}</div>}
                  </td>
                  <td className="p-3 text-xs">{course?.title ?? w.course_interest ?? w.interest_area ?? "General"}</td>
                  <td className="p-3 text-xs">
                    {w.preferred_training_mode ?? "—"}
                    {w.main_challenge && <div className="mt-1 max-w-xs text-foreground/60">{w.main_challenge}</div>}
                  </td>
                  <td className="p-3 text-xs text-foreground/60">{new Date(w.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-xs">
                    {w.emails_sent_at ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">Sent</span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-foreground/60">Not sent</span>
                    )}
                  </td>
                  <td className="p-3 text-xs">
                    <span className="rounded-full bg-muted px-2 py-0.5 font-semibold capitalize">{w.status}</span>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {w.status !== "contacted" && w.status !== "enrolled" && <button type="button" onClick={() => setStatus(w.id, "contacted")} className="rounded border border-border px-2 py-1">Contacted</button>}
                      {w.status !== "approved" && w.status !== "enrolled" && <button type="button" onClick={() => setStatus(w.id, "approved")} className="rounded border border-border px-2 py-1">Approved</button>}
                      {w.status !== "enrolled" && <button type="button" onClick={() => setEnrolling(enrolling === w.id ? null : w.id)} className="rounded bg-primary px-2 py-1 font-semibold text-primary-foreground">Enrol</button>}
                    </div>
                    {enrolling === w.id && <div className="mt-2"><EnrolForm initialEmail={w.email} waitlistId={w.id} onDone={() => { setEnrolling(null); refresh(); }} /></div>}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr><td colSpan={8} className="p-6 text-center text-foreground/60">No waitlist entries.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
