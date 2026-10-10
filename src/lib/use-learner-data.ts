import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getActiveSupabaseSession, supabase } from "@/lib/supabase";
import { findCourse } from "@/lib/academy-catalogue";
import { buildModules } from "@/lib/learning-content";

export type LearnerData = Awaited<ReturnType<typeof loadLearnerData>>;

async function loadLearnerData() {
  const session = await getActiveSupabaseSession();
  const user = session?.user;
  if (!user) throw new Error("Please sign in again.");
  const uid = user.id;
  const [starts, progress, subs, assess, plans, settings, links, waitlist] = await Promise.all([
    supabase.from("lms_course_starts").select("*").eq("user_id", uid),
    supabase.from("lms_lesson_progress").select("course_slug, lesson_key").eq("user_id", uid),
    supabase.from("lms_assignment_submissions").select("*").eq("user_id", uid).order("submitted_at", { ascending: false }),
    supabase.from("lms_assessment_status").select("course_slug, assessment_key, status").eq("user_id", uid),
    supabase.from("lms_action_plans").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
    supabase.from("lms_course_settings").select("*"),
    supabase.from("lms_assessment_links").select("*"),
    supabase.from("academy_waitlist").select("id, course_interest, interest_area, status, created_at").eq("user_id", uid).order("created_at", { ascending: false }),
  ]);
  for (const r of [starts, progress, subs, assess, plans, settings, links]) if (r.error) throw new Error(r.error.message);
  return {
    userId: uid,
    starts: starts.data ?? [],
    progress: progress.data ?? [],
    subs: subs.data ?? [],
    assess: assess.data ?? [],
    plans: plans.data ?? [],
    settings: settings.data ?? [],
    links: Object.fromEntries((links.data ?? []).map((l) => [l.assessment_key, l.url])) as Record<string, string>,
    waitlist: waitlist.data ?? [],
  };
}

export function isEnrolled(d: LearnerData, slug: string) {
  return d.starts.some((s) => s.course_slug === slug);
}

export function previewKeys(d: LearnerData, slug: string): Set<string> {
  const s = d.settings.find((x) => x.course_slug === slug);
  return new Set(s?.preview_enabled ? s.preview_lesson_keys : []);
}

export function useLearnerData() {
  return useQuery({ queryKey: ["learner-data"], queryFn: loadLearnerData });
}

export function useRefreshLearner() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["learner-data"] });
}

export type CertStatus = "Not eligible" | "In progress" | "Eligible" | "Issued";

/** Summary of one learner's progress in one catalogue course. */
export function courseSummary(d: LearnerData, slug: string) {
  const course = findCourse(slug)!;
  const modules = buildModules(course);
  const lessons = modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleTitle: m.title })));
  const done = new Set(d.progress.filter((p) => p.course_slug === slug).map((p) => p.lesson_key));
  const assignmentKeys = lessons.filter((l) => l.assignmentKey).map((l) => l.assignmentKey!);
  const submitted = new Set(d.subs.filter((s) => s.course_slug === slug).map((s) => s.assignment_key));
  const st = (k: string) => d.assess.find((a) => a.course_slug === slug && a.assessment_key === k)?.status ?? "not_started";
  const plan = d.plans.find((p) => p.course_slug === slug);
  const started = d.starts.find((s) => s.course_slug === slug);
  const percent = lessons.length ? Math.round((lessons.filter((l) => done.has(l.key)).length / lessons.length) * 100) : 0;
  const pending = lessons.filter((l) => l.assignmentKey && !submitted.has(l.assignmentKey!));
  const nextLesson = lessons.find((l) => !done.has(l.key)) ?? null;
  const allAssignments = assignmentKeys.every((k) => submitted.has(k));
  let cert: CertStatus = "Not eligible";
  if (started) cert = "In progress";
  if (percent === 100 && allAssignments && st("post-test") === "completed" && plan) cert = "Eligible";
  return {
    course, modules, lessons, done, submitted, started, percent, pending, nextLesson, plan,
    preTest: st("pre-test"), postTest: st("post-test"), cert,
    completed: (cert as CertStatus) === "Eligible",
  };
}
