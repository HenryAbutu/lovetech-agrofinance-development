
-- Phase 2 hardening: FK indexes, updated_at trigger on profiles, tighten enrolments.user_id

-- 1. Foreign-key indexes (perf)
CREATE INDEX IF NOT EXISTS idx_academy_modules_course_id ON public.academy_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_resources_course_id ON public.academy_resources(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_resources_module_id ON public.academy_resources(module_id);
CREATE INDEX IF NOT EXISTS idx_academy_enrolments_course_id ON public.academy_enrolments(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_enrolments_user_id ON public.academy_enrolments(user_id);
CREATE INDEX IF NOT EXISTS idx_academy_payments_course_id ON public.academy_payments(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_payments_enrolment_id ON public.academy_payments(enrolment_id);
CREATE INDEX IF NOT EXISTS idx_academy_waitlist_course_id ON public.academy_waitlist(course_id);
CREATE INDEX IF NOT EXISTS idx_video_script_prompts_course_id ON public.video_script_prompts(course_id);
CREATE INDEX IF NOT EXISTS idx_video_script_prompts_module_id ON public.video_script_prompts(module_id);
CREATE INDEX IF NOT EXISTS idx_video_script_prompts_created_by ON public.video_script_prompts(created_by);
CREATE INDEX IF NOT EXISTS idx_academy_lesson_progress_course_id ON public.academy_lesson_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_lesson_progress_lesson_id ON public.academy_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_academy_certificates_course_id ON public.academy_certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_quizzes_course_id ON public.academy_quizzes(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_quizzes_module_id ON public.academy_quizzes(module_id);
CREATE INDEX IF NOT EXISTS idx_academy_quiz_questions_quiz_id ON public.academy_quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_academy_quiz_attempts_course_id ON public.academy_quiz_attempts(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_quiz_attempts_quiz_id ON public.academy_quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_academy_assignments_course_id ON public.academy_assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_assignments_module_id ON public.academy_assignments(module_id);
CREATE INDEX IF NOT EXISTS idx_academy_assignment_submissions_assignment_id ON public.academy_assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_academy_assignment_submissions_course_id ON public.academy_assignment_submissions(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_learner_badges_badge_id ON public.academy_learner_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_academy_learner_badges_course_id ON public.academy_learner_badges(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_coupons_course_id ON public.academy_coupons(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_coupons_issued_to_user_id ON public.academy_coupons(issued_to_user_id);
CREATE INDEX IF NOT EXISTS idx_academy_coupon_redemptions_enrolment_id ON public.academy_coupon_redemptions(enrolment_id);
CREATE INDEX IF NOT EXISTS idx_academy_referrals_referred_enrolment_id ON public.academy_referrals(referred_enrolment_id);
CREATE INDEX IF NOT EXISTS idx_academy_referrals_reward_coupon_id ON public.academy_referrals(reward_coupon_id);
CREATE INDEX IF NOT EXISTS idx_academy_lesson_discussions_course_id ON public.academy_lesson_discussions(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_lesson_discussions_parent_id ON public.academy_lesson_discussions(parent_id);

-- Common lookup indexes
CREATE INDEX IF NOT EXISTS idx_academy_courses_status ON public.academy_courses(status);
CREATE INDEX IF NOT EXISTS idx_academy_lessons_course_module ON public.academy_lessons(course_id, module_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_academy_lesson_progress_user_course ON public.academy_lesson_progress(user_id, course_id);

-- 2. Enforce NOT NULL on academy_enrolments.user_id (data already clean)
ALTER TABLE public.academy_enrolments ALTER COLUMN user_id SET NOT NULL;

-- 3. Missing updated_at trigger on profiles
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Blog posts: add published_at + chronological index
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
UPDATE public.blog_posts SET published_at = created_at WHERE status = 'published' AND published_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published ON public.blog_posts(status, published_at DESC);
