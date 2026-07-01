import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------- Types ----------
export type QuizOption = { id: string; text: string };
export type QuizQuestionPublic = {
  id: string;
  prompt: string;
  question_type: string;
  options: QuizOption[];
  points: number;
  sort_order: number;
};

// ---------- Learner: get course assessments ----------
export const getCourseAssessments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: course, error: cErr } = await supabase
      .from("academy_courses")
      .select("id, slug, title")
      .eq("slug", data.slug)
      .maybeSingle();
    if (cErr) throw new Error(cErr.message);
    if (!course) throw new Error("Course not found");

    const [quizzesRes, assignsRes, attemptsRes, submissionsRes] = await Promise.all([
      supabase.from("academy_quizzes")
        .select("id, module_id, title, description, pass_score, max_attempts, sort_order, is_published")
        .eq("course_id", course.id)
        .eq("is_published", true)
        .order("sort_order"),
      supabase.from("academy_assignments")
        .select("id, module_id, title, instructions, submission_type, max_points, sort_order, is_published")
        .eq("course_id", course.id)
        .eq("is_published", true)
        .order("sort_order"),
      supabase.from("academy_quiz_attempts")
        .select("id, quiz_id, score, earned_points, total_points, passed, submitted_at, attempt_number")
        .eq("user_id", userId)
        .eq("course_id", course.id)
        .order("submitted_at", { ascending: false }),
      supabase.from("academy_assignment_submissions")
        .select("id, assignment_id, status, score, feedback, submitted_at, graded_at")
        .eq("user_id", userId)
        .eq("course_id", course.id)
        .order("submitted_at", { ascending: false }),
    ]);

    return {
      course,
      quizzes: quizzesRes.data ?? [],
      assignments: assignsRes.data ?? [],
      attempts: attemptsRes.data ?? [],
      submissions: submissionsRes.data ?? [],
    };
  });

// ---------- Learner: get single quiz (with questions, without correct answers) ----------
export const getQuizForAttempt = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ quiz_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: quiz, error: qErr } = await supabase
      .from("academy_quizzes")
      .select("id, course_id, module_id, title, description, pass_score, max_attempts")
      .eq("id", data.quiz_id)
      .maybeSingle();
    if (qErr) throw new Error(qErr.message);
    if (!quiz) throw new Error("Quiz not found");

    const { data: questions, error: quErr } = await supabase
      .from("academy_quiz_questions")
      .select("id, prompt, question_type, options, points, sort_order")
      .eq("quiz_id", quiz.id)
      .order("sort_order");
    if (quErr) throw new Error(quErr.message);

    const { data: attempts } = await supabase
      .from("academy_quiz_attempts")
      .select("id, score, passed, attempt_number, submitted_at, earned_points, total_points")
      .eq("quiz_id", quiz.id)
      .eq("user_id", userId)
      .order("attempt_number", { ascending: false });

    return {
      quiz,
      questions: (questions ?? []).map((q) => ({
        ...q,
        options: Array.isArray(q.options) ? (q.options as QuizOption[]) : [],
      })),
      attempts: attempts ?? [],
    };
  });

// ---------- Learner: submit quiz attempt ----------
const submitQuizSchema = z.object({
  quiz_id: z.string().uuid(),
  answers: z.record(z.string(), z.array(z.string()).max(20)),
});

export const submitQuizAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => submitQuizSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: quiz, error: qErr } = await supabase
      .from("academy_quizzes")
      .select("id, course_id, pass_score, max_attempts")
      .eq("id", data.quiz_id)
      .maybeSingle();
    if (qErr) throw new Error(qErr.message);
    if (!quiz) throw new Error("Quiz not found");

    const { data: existing } = await supabase
      .from("academy_quiz_attempts")
      .select("id, attempt_number")
      .eq("quiz_id", quiz.id)
      .eq("user_id", userId)
      .order("attempt_number", { ascending: false })
      .limit(1);
    const priorMax = existing?.[0]?.attempt_number ?? 0;
    if (priorMax >= quiz.max_attempts) throw new Error(`No attempts remaining (max ${quiz.max_attempts})`);

    // Load full questions with correct answers via service role (learners can't read correct_option_ids)
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: questions } = await supabaseAdmin
      .from("academy_quiz_questions")
      .select("id, correct_option_ids, points")
      .eq("quiz_id", quiz.id);
    if (!questions?.length) throw new Error("Quiz has no questions");

    let earned = 0;
    let total = 0;
    for (const q of questions) {
      total += q.points;
      const given = new Set(data.answers[q.id] ?? []);
      const correct = new Set(Array.isArray(q.correct_option_ids) ? (q.correct_option_ids as string[]) : []);
      if (given.size === correct.size && [...given].every((id) => correct.has(id))) {
        earned += q.points;
      }
    }
    const score = total > 0 ? Math.round((earned / total) * 10000) / 100 : 0;
    const passed = score >= quiz.pass_score;
    const attempt_number = priorMax + 1;

    const { data: inserted, error: insErr } = await supabase
      .from("academy_quiz_attempts")
      .insert({
        user_id: userId,
        quiz_id: quiz.id,
        course_id: quiz.course_id,
        score,
        earned_points: earned,
        total_points: total,
        passed,
        answers: data.answers,
        attempt_number,
      })
      .select("id")
      .single();
    if (insErr) throw new Error(insErr.message);

    // Auto-award badges
    if (passed) await awardBadgeSafe(userId, "first_quiz_passed", quiz.course_id);
    if (score === 100) await awardBadgeSafe(userId, "perfect_quiz", quiz.course_id);

    return { attempt_id: inserted.id, score, earned_points: earned, total_points: total, passed, attempt_number };
  });

// ---------- Learner: submit assignment ----------
const submitAssignmentSchema = z.object({
  assignment_id: z.string().uuid(),
  submission_text: z.string().max(20000).optional(),
  submission_url: z.string().url().max(500).optional(),
});

export const submitAssignment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => submitAssignmentSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    if (!data.submission_text && !data.submission_url) {
      throw new Error("Provide submission text or URL");
    }
    const { data: assn, error: aErr } = await supabase
      .from("academy_assignments")
      .select("id, course_id, submission_type")
      .eq("id", data.assignment_id)
      .maybeSingle();
    if (aErr) throw new Error(aErr.message);
    if (!assn) throw new Error("Assignment not found");

    // Upsert-style: allow one active submission per assignment (update if exists and not graded)
    const { data: existing } = await supabase
      .from("academy_assignment_submissions")
      .select("id, status")
      .eq("assignment_id", assn.id)
      .eq("user_id", userId)
      .maybeSingle();

    if (existing && existing.status === "graded") {
      throw new Error("Your submission has already been graded and can't be changed");
    }

    if (existing) {
      const { error: upErr } = await supabase
        .from("academy_assignment_submissions")
        .update({
          submission_text: data.submission_text ?? null,
          submission_url: data.submission_url ?? null,
          status: "submitted",
          submitted_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      if (upErr) throw new Error(upErr.message);
    } else {
      const { error: insErr } = await supabase
        .from("academy_assignment_submissions")
        .insert({
          user_id: userId,
          assignment_id: assn.id,
          course_id: assn.course_id,
          submission_text: data.submission_text ?? null,
          submission_url: data.submission_url ?? null,
          status: "submitted",
        });
      if (insErr) throw new Error(insErr.message);
    }

    await awardBadgeSafe(userId, "assignment_submitted", assn.course_id);
    return { ok: true };
  });

// ---------- Admin: grade assignment ----------
const gradeSchema = z.object({
  submission_id: z.string().uuid(),
  score: z.number().int().min(0).max(1000),
  feedback: z.string().max(4000).optional(),
});

export const gradeAssignmentSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => gradeSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");

    const { error } = await supabase
      .from("academy_assignment_submissions")
      .update({
        status: "graded",
        score: data.score,
        feedback: data.feedback ?? null,
        graded_by: userId,
        graded_at: new Date().toISOString(),
      })
      .eq("id", data.submission_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Helper: safe badge award (service role) ----------
async function awardBadgeSafe(user_id: string, code: string, course_id: string | null) {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: badge } = await supabaseAdmin.from("academy_badges").select("id").eq("code", code).maybeSingle();
    if (!badge) return;
    await supabaseAdmin
      .from("academy_learner_badges")
      .insert({ user_id, badge_id: badge.id, course_id })
      .select("id")
      .maybeSingle();
  } catch {
    // no-op: unique constraint or transient failure shouldn't break submission
  }
}
