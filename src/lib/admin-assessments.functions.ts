import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!data) throw new Error("Forbidden");
}

export const adminListAssessments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ course_id: z.string().uuid().optional() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);

    const courses = await supabase.from("academy_courses").select("id, title, slug").order("title");

    const quizQuery = supabase.from("academy_quizzes")
      .select("id, course_id, module_id, title, description, pass_score, max_attempts, is_published, sort_order")
      .order("sort_order");
    const assnQuery = supabase.from("academy_assignments")
      .select("id, course_id, module_id, title, instructions, submission_type, max_points, is_published, sort_order")
      .order("sort_order");

    const [q, a] = await Promise.all([
      data.course_id ? quizQuery.eq("course_id", data.course_id) : quizQuery,
      data.course_id ? assnQuery.eq("course_id", data.course_id) : assnQuery,
    ]);

    return { courses: courses.data ?? [], quizzes: q.data ?? [], assignments: a.data ?? [] };
  });

export const adminUpsertQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({
    id: z.string().uuid().optional(),
    course_id: z.string().uuid(),
    module_id: z.string().uuid().nullable().optional(),
    title: z.string().min(1).max(200),
    description: z.string().max(2000).optional(),
    pass_score: z.number().int().min(0).max(100).default(70),
    max_attempts: z.number().int().min(1).max(20).default(3),
    is_published: z.boolean().default(true),
    sort_order: z.number().int().default(0),
  }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const payload = { ...data, description: data.description ?? null, module_id: data.module_id ?? null };
    if (data.id) {
      const { error } = await supabase.from("academy_quizzes").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: ins, error } = await supabase.from("academy_quizzes").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    return { id: ins.id };
  });

export const adminDeleteQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("academy_quizzes").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const optionSchema = z.object({ id: z.string().min(1).max(60), text: z.string().min(1).max(500) });

export const adminListQuizQuestions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ quiz_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: quiz } = await context.supabase.from("academy_quizzes").select("id, title, course_id").eq("id", data.quiz_id).single();
    const { data: questions } = await context.supabase
      .from("academy_quiz_questions")
      .select("id, prompt, question_type, options, correct_option_ids, explanation, points, sort_order")
      .eq("quiz_id", data.quiz_id)
      .order("sort_order");
    return { quiz, questions: questions ?? [] };
  });

export const adminUpsertQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({
    id: z.string().uuid().optional(),
    quiz_id: z.string().uuid(),
    prompt: z.string().min(1).max(2000),
    question_type: z.enum(["single_choice", "multi_choice", "true_false"]).default("single_choice"),
    options: z.array(optionSchema).min(2).max(10),
    correct_option_ids: z.array(z.string()).min(1).max(10),
    explanation: z.string().max(2000).optional(),
    points: z.number().int().min(1).max(100).default(1),
    sort_order: z.number().int().default(0),
  }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const payload = { ...data, explanation: data.explanation ?? null };
    if (data.id) {
      const { error } = await context.supabase.from("academy_quiz_questions").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: ins, error } = await context.supabase.from("academy_quiz_questions").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    return { id: ins.id };
  });

export const adminDeleteQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("academy_quiz_questions").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUpsertAssignment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({
    id: z.string().uuid().optional(),
    course_id: z.string().uuid(),
    module_id: z.string().uuid().nullable().optional(),
    title: z.string().min(1).max(200),
    instructions: z.string().min(1).max(10000),
    submission_type: z.enum(["text", "url", "both"]).default("text"),
    max_points: z.number().int().min(1).max(1000).default(100),
    is_published: z.boolean().default(true),
    sort_order: z.number().int().default(0),
  }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const payload = { ...data, module_id: data.module_id ?? null };
    if (data.id) {
      const { error } = await context.supabase.from("academy_assignments").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: ins, error } = await context.supabase.from("academy_assignments").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    return { id: ins.id };
  });

export const adminDeleteAssignment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("academy_assignments").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({
    course_id: z.string().uuid().optional(),
    status: z.enum(["submitted", "graded", "needs_revision"]).optional(),
  }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("academy_assignment_submissions")
      .select("id, user_id, assignment_id, course_id, submission_text, submission_url, status, score, feedback, submitted_at, graded_at")
      .order("submitted_at", { ascending: false })
      .limit(200);
    if (data.course_id) q = q.eq("course_id", data.course_id);
    if (data.status) q = q.eq("status", data.status);
    const { data: subs } = await q;

    const ids = Array.from(new Set((subs ?? []).map((s) => s.user_id)));
    const [profiles, assigns] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, full_name, email").in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]),
      supabaseAdmin.from("academy_assignments").select("id, title, max_points"),
    ]);
    const pMap = new Map((profiles.data ?? []).map((p) => [p.id, p]));
    const aMap = new Map((assigns.data ?? []).map((a) => [a.id, a]));

    return {
      submissions: (subs ?? []).map((s) => ({
        ...s,
        learner: pMap.get(s.user_id) ?? null,
        assignment: aMap.get(s.assignment_id) ?? null,
      })),
    };
  });
