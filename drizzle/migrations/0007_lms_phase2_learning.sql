CREATE TABLE public.lms_course_starts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_slug text NOT NULL,
  cohort_name text,
  started_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_slug)
);
CREATE TABLE public.lms_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_slug text NOT NULL,
  lesson_key text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_slug, lesson_key)
);
CREATE TABLE public.lms_assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_slug text NOT NULL,
  assignment_key text NOT NULL,
  assignment_title text NOT NULL,
  module_title text,
  submission_text text,
  link_url text,
  notes text,
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','reviewed','needs_revision','accepted')),
  feedback text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.lms_assessment_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_slug text NOT NULL,
  assessment_key text NOT NULL,
  status text NOT NULL DEFAULT 'started' CHECK (status IN ('started','completed')),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_slug, assessment_key)
);
CREATE TABLE public.lms_action_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_slug text NOT NULL,
  business_name text,
  plan_type text NOT NULL CHECK (plan_type IN ('business_improvement','value_addition','market_linkage','certification_readiness','labour_market_participation')),
  main_goal text NOT NULL,
  key_actions text NOT NULL,
  resources_needed text,
  support_needed text,
  timeline text,
  expected_result text,
  risks text,
  next_steps text,
  status text NOT NULL DEFAULT 'submitted',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lms_course_starts, public.lms_lesson_progress, public.lms_assignment_submissions, public.lms_assessment_status, public.lms_action_plans TO authenticated;
GRANT ALL ON public.lms_course_starts, public.lms_lesson_progress, public.lms_assignment_submissions, public.lms_assessment_status, public.lms_action_plans TO service_role;

ALTER TABLE public.lms_course_starts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lms_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lms_assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lms_assessment_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lms_action_plans ENABLE ROW LEVEL SECURITY;

-- course starts
CREATE POLICY "starts own or admin read" ON public.lms_course_starts FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "starts own insert" ON public.lms_course_starts FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND cohort_name IS NULL);
CREATE POLICY "starts admin update" ON public.lms_course_starts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- lesson progress
CREATE POLICY "progress own or admin read" ON public.lms_lesson_progress FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "progress own insert" ON public.lms_lesson_progress FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "progress own delete" ON public.lms_lesson_progress FOR DELETE TO authenticated USING (user_id = auth.uid());

-- assignments
CREATE POLICY "subs own or admin read" ON public.lms_assignment_submissions FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "subs own insert" ON public.lms_assignment_submissions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'submitted' AND feedback IS NULL);
CREATE POLICY "subs admin update" ON public.lms_assignment_submissions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- assessments
CREATE POLICY "assess own or admin read" ON public.lms_assessment_status FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "assess own insert" ON public.lms_assessment_status FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "assess own update" ON public.lms_assessment_status FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- action plans
CREATE POLICY "plans own or admin read" ON public.lms_action_plans FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "plans own insert" ON public.lms_action_plans FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'submitted');

CREATE INDEX lms_progress_user_course ON public.lms_lesson_progress (user_id, course_slug);
CREATE INDEX lms_subs_user_course ON public.lms_assignment_submissions (user_id, course_slug);
CREATE INDEX lms_plans_user ON public.lms_action_plans (user_id);