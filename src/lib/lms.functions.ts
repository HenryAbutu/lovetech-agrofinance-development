import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function getPublicClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

// Public course + preview lessons (safe for sales page during SSR)
export const getPublicCourse = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data }) => {
    const sb = getPublicClient();
    const { data: course, error } = await sb
      .from("academy_courses")
      .select("id, slug, title, subtitle, description, discount_price, regular_price, status, delivery_mode, course_image")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!course) throw new Error("Course not found");

    const { data: modules } = await sb
      .from("academy_modules")
      .select("id, module_number, title, sort_order")
      .eq("course_id", course.id)
      .order("sort_order");

    const { data: previewLessons } = await sb
      .from("academy_lessons")
      .select("id, module_id, title, sort_order, is_preview")
      .eq("course_id", course.id)
      .eq("is_preview", true)
      .order("sort_order");

    return { course, modules: modules ?? [], previewLessons: previewLessons ?? [] };
  });

// Enrolled learner content: full modules + lessons + progress
export const getMyCourseContent = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: course, error: cErr } = await supabase
      .from("academy_courses")
      .select("id, slug, title, subtitle, description, discount_price, course_image")
      .eq("slug", data.slug)
      .maybeSingle();
    if (cErr) throw new Error(cErr.message);
    if (!course) throw new Error("Course not found");

    const { data: enrolment } = await supabase
      .from("academy_enrolments")
      .select("id, payment_status, access_status")
      .eq("user_id", userId)
      .eq("course_id", course.id)
      .maybeSingle();

    const hasAccess = enrolment?.access_status === "active";

    const { data: modules } = await supabase
      .from("academy_modules")
      .select("id, module_number, title, sort_order")
      .eq("course_id", course.id)
      .order("sort_order");

    const { data: lessons } = await supabase
      .from("academy_lessons")
      .select("id, module_id, title, description, video_url, resource_url, duration_minutes, sort_order, is_preview")
      .eq("course_id", course.id)
      .order("sort_order");

    const { data: progress } = await supabase
      .from("academy_lesson_progress")
      .select("lesson_id, completed, completed_at")
      .eq("user_id", userId)
      .eq("course_id", course.id);

    const { data: certificate } = await supabase
      .from("academy_certificates")
      .select("id, status, certificate_id, certificate_pdf_url, issued_at, certificate_name")
      .eq("user_id", userId)
      .eq("course_id", course.id)
      .maybeSingle();

    return {
      course,
      enrolment,
      hasAccess,
      modules: modules ?? [],
      lessons: lessons ?? [],
      progress: progress ?? [],
      certificate,
    };
  });

export const markLessonComplete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ lesson_id: z.string().uuid(), course_id: z.string().uuid(), completed: z.boolean().default(true) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("academy_lesson_progress")
      .upsert(
        {
          user_id: userId,
          lesson_id: data.lesson_id,
          course_id: data.course_id,
          completed: data.completed,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });
