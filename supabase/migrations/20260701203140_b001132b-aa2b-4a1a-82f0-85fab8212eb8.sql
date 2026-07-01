
-- =========================================================
-- Phase 3: Assessments & Gamification
-- =========================================================

-- ---------- QUIZZES ----------
CREATE TABLE public.academy_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES public.academy_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  pass_score INT NOT NULL DEFAULT 70,
  max_attempts INT NOT NULL DEFAULT 3,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_quizzes TO authenticated;
GRANT ALL ON public.academy_quizzes TO service_role;
ALTER TABLE public.academy_quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enrolled learners read quizzes" ON public.academy_quizzes FOR SELECT TO authenticated
USING (public.is_enrolled_in_course(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage quizzes" ON public.academy_quizzes FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_quizzes_updated BEFORE UPDATE ON public.academy_quizzes
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- QUIZ QUESTIONS ----------
CREATE TABLE public.academy_quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.academy_quizzes(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'single_choice', -- single_choice | multi_choice | true_false
  options JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{id, text}]
  correct_option_ids JSONB NOT NULL DEFAULT '[]'::jsonb, -- [id, ...]
  explanation TEXT,
  points INT NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_quiz_questions TO authenticated;
GRANT ALL ON public.academy_quiz_questions TO service_role;
ALTER TABLE public.academy_quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enrolled learners read quiz questions" ON public.academy_quiz_questions FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.academy_quizzes q WHERE q.id = quiz_id
  AND (public.is_enrolled_in_course(auth.uid(), q.course_id) OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Admins manage quiz questions" ON public.academy_quiz_questions FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_quiz_questions_updated BEFORE UPDATE ON public.academy_quiz_questions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- QUIZ ATTEMPTS ----------
CREATE TABLE public.academy_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  quiz_id UUID NOT NULL REFERENCES public.academy_quizzes(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  score NUMERIC(5,2) NOT NULL DEFAULT 0, -- percentage 0-100
  total_points INT NOT NULL DEFAULT 0,
  earned_points INT NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb, -- { [question_id]: [option_ids] }
  attempt_number INT NOT NULL DEFAULT 1,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.academy_quiz_attempts TO authenticated;
GRANT ALL ON public.academy_quiz_attempts TO service_role;
ALTER TABLE public.academy_quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Learners read own attempts" ON public.academy_quiz_attempts FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Learners insert own attempts" ON public.academy_quiz_attempts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND public.is_enrolled_in_course(auth.uid(), course_id));
CREATE INDEX idx_quiz_attempts_user_quiz ON public.academy_quiz_attempts(user_id, quiz_id);

-- ---------- ASSIGNMENTS ----------
CREATE TABLE public.academy_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES public.academy_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  instructions TEXT NOT NULL,
  submission_type TEXT NOT NULL DEFAULT 'text', -- text | url | both
  max_points INT NOT NULL DEFAULT 100,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_assignments TO authenticated;
GRANT ALL ON public.academy_assignments TO service_role;
ALTER TABLE public.academy_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enrolled learners read assignments" ON public.academy_assignments FOR SELECT TO authenticated
USING (public.is_enrolled_in_course(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage assignments" ON public.academy_assignments FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_assignments_updated BEFORE UPDATE ON public.academy_assignments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- ASSIGNMENT SUBMISSIONS ----------
CREATE TABLE public.academy_assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  assignment_id UUID NOT NULL REFERENCES public.academy_assignments(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  submission_text TEXT,
  submission_url TEXT,
  status TEXT NOT NULL DEFAULT 'submitted', -- submitted | graded | needs_revision
  score INT,
  feedback TEXT,
  graded_by UUID,
  graded_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.academy_assignment_submissions TO authenticated;
GRANT ALL ON public.academy_assignment_submissions TO service_role;
ALTER TABLE public.academy_assignment_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Learners read own submissions" ON public.academy_assignment_submissions FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Learners insert own submissions" ON public.academy_assignment_submissions FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND public.is_enrolled_in_course(auth.uid(), course_id));
CREATE POLICY "Learners update own ungraded" ON public.academy_assignment_submissions FOR UPDATE TO authenticated
USING (auth.uid() = user_id AND status <> 'graded') WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins update submissions" ON public.academy_assignment_submissions FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_submissions_updated BEFORE UPDATE ON public.academy_assignment_submissions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- BADGES CATALOG ----------
CREATE TABLE public.academy_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE, -- e.g. first_quiz_passed, course_complete, perfect_score
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'award', -- lucide icon name
  color TEXT NOT NULL DEFAULT '#C8941F',
  criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.academy_badges TO authenticated, anon;
GRANT ALL ON public.academy_badges TO service_role;
ALTER TABLE public.academy_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads badges" ON public.academy_badges FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Admins manage badges" ON public.academy_badges FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ---------- LEARNER BADGE AWARDS ----------
CREATE TABLE public.academy_learner_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  badge_id UUID NOT NULL REFERENCES public.academy_badges(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge_id, course_id)
);
GRANT SELECT ON public.academy_learner_badges TO authenticated;
GRANT ALL ON public.academy_learner_badges TO service_role;
ALTER TABLE public.academy_learner_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Learners read own badges" ON public.academy_learner_badges FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- ---------- LEADERBOARD OPT-IN + POINTS ----------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS leaderboard_opt_in BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Materialized-ish view: total points per learner per course from quizzes + assignments
CREATE OR REPLACE VIEW public.academy_learner_points AS
SELECT
  u.user_id,
  u.course_id,
  COALESCE(quiz_points, 0) + COALESCE(assign_points, 0) AS total_points,
  COALESCE(quiz_points, 0) AS quiz_points,
  COALESCE(assign_points, 0) AS assign_points,
  COALESCE(badge_count, 0) AS badge_count
FROM (
  SELECT DISTINCT user_id, course_id FROM public.academy_enrolments WHERE access_status = 'active'
) u
LEFT JOIN (
  SELECT user_id, course_id, SUM(earned_points)::int AS quiz_points
  FROM (
    SELECT DISTINCT ON (user_id, quiz_id) user_id, quiz_id, course_id, earned_points
    FROM public.academy_quiz_attempts
    ORDER BY user_id, quiz_id, earned_points DESC, submitted_at DESC
  ) best
  GROUP BY user_id, course_id
) qp ON qp.user_id = u.user_id AND qp.course_id = u.course_id
LEFT JOIN (
  SELECT user_id, course_id, COALESCE(SUM(score),0)::int AS assign_points
  FROM public.academy_assignment_submissions
  WHERE status = 'graded' AND score IS NOT NULL
  GROUP BY user_id, course_id
) ap ON ap.user_id = u.user_id AND ap.course_id = u.course_id
LEFT JOIN (
  SELECT user_id, course_id, COUNT(*)::int AS badge_count
  FROM public.academy_learner_badges
  WHERE course_id IS NOT NULL
  GROUP BY user_id, course_id
) bp ON bp.user_id = u.user_id AND bp.course_id = u.course_id;

GRANT SELECT ON public.academy_learner_points TO authenticated;

-- Seed core badges
INSERT INTO public.academy_badges (code, name, description, icon, color, sort_order) VALUES
  ('first_lesson', 'First Steps', 'Completed your first lesson', 'footprints', '#1F4D3C', 10),
  ('first_quiz_passed', 'Quiz Rookie', 'Passed your first quiz', 'check-circle', '#1F4D3C', 20),
  ('perfect_quiz', 'Perfect Score', 'Scored 100% on a quiz', 'star', '#C8941F', 30),
  ('assignment_submitted', 'Doer', 'Submitted your first assignment', 'send', '#1F4D3C', 40),
  ('course_complete', 'Course Champion', 'Completed a full course', 'trophy', '#C8941F', 50),
  ('streak_3', '3-Day Streak', 'Learned 3 days in a row', 'flame', '#C8941F', 60)
ON CONFLICT (code) DO NOTHING;
