CREATE OR REPLACE FUNCTION public.is_lms_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','super_admin','facilitator','instructor'))
$$;

CREATE TABLE public.lms_cohorts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_slug text NOT NULL,
  name text NOT NULL,
  location text,
  start_date date,
  end_date date,
  delivery_mode text,
  facilitator_id uuid,
  status text NOT NULL DEFAULT 'planned',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lms_cohorts TO authenticated;
GRANT ALL ON public.lms_cohorts TO service_role;
ALTER TABLE public.lms_cohorts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cohorts staff read" ON public.lms_cohorts FOR SELECT TO authenticated USING (public.is_lms_staff(auth.uid()));
CREATE POLICY "cohorts admin write" ON public.lms_cohorts FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

ALTER TABLE public.lms_course_starts ADD COLUMN IF NOT EXISTS access_status text NOT NULL DEFAULT 'active';
ALTER TABLE public.lms_course_starts ADD COLUMN IF NOT EXISTS cohort_id uuid REFERENCES public.lms_cohorts(id) ON DELETE SET NULL;
ALTER TABLE public.lms_course_starts ADD CONSTRAINT lms_course_starts_access_chk CHECK (access_status IN ('enrolled','active','completed','suspended'));
CREATE POLICY "starts staff read" ON public.lms_course_starts FOR SELECT TO authenticated USING (public.is_lms_staff(auth.uid()));

CREATE OR REPLACE FUNCTION public.lms_is_enrolled(_user_id uuid, _slug text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.lms_course_starts WHERE user_id = _user_id AND course_slug = _slug AND access_status <> 'suspended')
$$;

ALTER TABLE public.lms_assignment_submissions ADD COLUMN IF NOT EXISTS reviewed_by uuid, ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;
CREATE POLICY "subs staff read" ON public.lms_assignment_submissions FOR SELECT TO authenticated USING (public.is_lms_staff(auth.uid()));
CREATE POLICY "subs staff update" ON public.lms_assignment_submissions FOR UPDATE TO authenticated USING (public.is_lms_staff(auth.uid())) WITH CHECK (public.is_lms_staff(auth.uid()));

ALTER TABLE public.lms_action_plans ADD COLUMN IF NOT EXISTS feedback text, ADD COLUMN IF NOT EXISTS reviewed_by uuid, ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;
CREATE POLICY "plans staff read" ON public.lms_action_plans FOR SELECT TO authenticated USING (public.is_lms_staff(auth.uid()));
CREATE POLICY "plans staff update" ON public.lms_action_plans FOR UPDATE TO authenticated USING (public.is_lms_staff(auth.uid())) WITH CHECK (public.is_lms_staff(auth.uid()));

CREATE POLICY "assess staff read" ON public.lms_assessment_status FOR SELECT TO authenticated USING (public.is_lms_staff(auth.uid()));
CREATE POLICY "progress staff read" ON public.lms_lesson_progress FOR SELECT TO authenticated USING (public.is_lms_staff(auth.uid()));
CREATE POLICY "profiles staff read" ON public.profiles FOR SELECT TO authenticated USING (public.is_lms_staff(auth.uid()));

CREATE TABLE public.lms_coaching_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_slug text NOT NULL,
  cohort_id uuid REFERENCES public.lms_cohorts(id) ON DELETE SET NULL,
  user_id uuid NOT NULL,
  touchpoint_number integer NOT NULL DEFAULT 1,
  session_date date NOT NULL DEFAULT current_date,
  mode text NOT NULL DEFAULT 'online' CHECK (mode IN ('online','phone','whatsapp','in-person')),
  notes text,
  follow_up_action text,
  staff_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lms_coaching_logs TO authenticated;
GRANT ALL ON public.lms_coaching_logs TO service_role;
ALTER TABLE public.lms_coaching_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "coaching staff read" ON public.lms_coaching_logs FOR SELECT TO authenticated USING (public.is_lms_staff(auth.uid()));
CREATE POLICY "coaching staff insert" ON public.lms_coaching_logs FOR INSERT TO authenticated WITH CHECK (public.is_lms_staff(auth.uid()) AND staff_id = auth.uid());
CREATE POLICY "coaching admin delete" ON public.lms_coaching_logs FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.lms_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id uuid NOT NULL REFERENCES public.lms_cohorts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  session_label text NOT NULL,
  session_date date NOT NULL DEFAULT current_date,
  present boolean NOT NULL DEFAULT true,
  recorded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cohort_id, user_id, session_label)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lms_attendance TO authenticated;
GRANT ALL ON public.lms_attendance TO service_role;
ALTER TABLE public.lms_attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attendance staff all" ON public.lms_attendance FOR ALL TO authenticated USING (public.is_lms_staff(auth.uid())) WITH CHECK (public.is_lms_staff(auth.uid()));
CREATE POLICY "attendance own read" ON public.lms_attendance FOR SELECT TO authenticated USING (user_id = auth.uid());