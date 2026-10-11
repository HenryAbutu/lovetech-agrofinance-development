// Shared client-side helpers for the LMS admin/programme-management pages.
// All queries run as the signed-in staff member; database policies decide what they can see or change.
import { supabase } from "@/lib/supabase";
import { findCourse } from "@/lib/academy-catalogue";

export const REVIEW_STATUSES = ["submitted", "reviewed", "needs_revision", "approved"] as const;
export const ACCESS_STATUSES = ["enrolled", "active", "completed", "suspended"] as const;
export const COACHING_MODES = ["online", "phone", "whatsapp", "in-person"] as const;

export const courseTitle = (slug: string) => findCourse(slug)?.title.split(":")[0] ?? slug;
export const label = (s?: string | null) => (s ?? "—").replaceAll("_", " ");

export async function loadLmsAdmin() {
  const [starts, profiles, cohorts, subs, plans, assess, progress, coaching, attendance, waitlist] = await Promise.all([
    supabase.from("lms_course_starts").select("*").order("started_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name, email, phone, business_name, location"),
    supabase.from("lms_cohorts").select("*").order("start_date", { ascending: false, nullsFirst: false }),
    supabase.from("lms_assignment_submissions").select("*").order("submitted_at", { ascending: false }),
    supabase.from("lms_action_plans").select("*").order("created_at", { ascending: false }),
    supabase.from("lms_assessment_status").select("*"),
    supabase.from("lms_lesson_progress").select("user_id, course_slug, lesson_key"),
    supabase.from("lms_coaching_logs").select("*").order("session_date", { ascending: false }),
    supabase.from("lms_attendance").select("*").order("session_date", { ascending: false }),
    supabase.from("academy_waitlist").select("id, status, course_interest, interest_area, created_at"),
  ]);
  for (const r of [starts, profiles, cohorts, subs, plans, assess, progress, coaching, attendance]) if (r.error) throw new Error(r.error.message);
  const prof = new Map((profiles.data ?? []).map((p) => [p.id, p]));
  return {
    starts: starts.data ?? [],
    profiles: profiles.data ?? [],
    cohorts: cohorts.data ?? [],
    subs: subs.data ?? [],
    plans: plans.data ?? [],
    assess: assess.data ?? [],
    progress: progress.data ?? [],
    coaching: coaching.data ?? [],
    attendance: attendance.data ?? [],
    waitlist: waitlist.data ?? [], // facilitators cannot read the waitlist; empty for them
    person: (id: string) => prof.get(id),
    cohortName: (id?: string | null) => (cohorts.data ?? []).find((c) => c.id === id)?.name,
    cohortOf: (uid: string, slug: string) => (starts.data ?? []).find((s) => s.user_id === uid && s.course_slug === slug),
  };
}
export type LmsAdminData = Awaited<ReturnType<typeof loadLmsAdmin>>;
export const LMS_ADMIN_KEY = ["lms-admin"];

export function downloadCsv(name: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  const esc = (v: unknown) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const inputCls = "mt-1 block w-full rounded-md border border-input bg-background p-2 text-sm";
export const selectCls = "rounded-md border border-input bg-background p-2 text-sm";
