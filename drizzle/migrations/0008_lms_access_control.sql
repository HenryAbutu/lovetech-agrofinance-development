CREATE TABLE public.lms_course_settings (
  course_slug text PRIMARY KEY,
  preview_enabled boolean NOT NULL DEFAULT false,
  preview_lesson_keys text[] NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.lms_assessment_links (
  assessment_key text PRIMARY KEY,
  url text NOT NULL DEFAULT '' CHECK (url = '' OR url ~* '^https?://'),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.lms_course_settings, public.lms_assessment_links TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.lms_course_settings, public.lms_assessment_links TO authenticated;
GRANT ALL ON public.lms_course_settings, public.lms_assessment_links TO service_role;
ALTER TABLE public.lms_course_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lms_assessment_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.lms_course_settings FOR SELECT TO anon, authenticated USING (char_length(course_slug) > 0);
CREATE POLICY "settings admin write" ON public.lms_course_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "links public read" ON public.lms_assessment_links FOR SELECT TO anon, authenticated USING (char_length(assessment_key) > 0);
CREATE POLICY "links admin write" ON public.lms_assessment_links FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.lms_course_settings (course_slug, preview_enabled, preview_lesson_keys) VALUES
  ('ai-for-businesses', true, ARRAY['welcome','m1-video','m1-notes']),
  ('agribusiness-skills', false, '{}')
ON CONFLICT DO NOTHING;
INSERT INTO public.lms_assessment_links (assessment_key, url) VALUES
  ('pre-test',''),('post-test',''),('feedback',''),('skills-needs',''),('finance-diagnostic','')
ON CONFLICT DO NOTHING;

-- Enrolments: lms_course_starts now means "approved enrolment", created by admins only.
ALTER TABLE public.lms_course_starts ADD COLUMN enrolled_by uuid, ADD COLUMN waitlist_id uuid;
COMMENT ON TABLE public.lms_course_starts IS 'Approved learner enrolments for catalogue courses (admin-created).';
DROP POLICY "starts own insert" ON public.lms_course_starts;
CREATE POLICY "starts admin insert" ON public.lms_course_starts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "starts admin delete" ON public.lms_course_starts FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.lms_is_enrolled(_user_id uuid, _slug text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ SELECT EXISTS (SELECT 1 FROM public.lms_course_starts WHERE user_id = _user_id AND course_slug = _slug) $$;

DROP POLICY "progress own insert" ON public.lms_lesson_progress;
CREATE POLICY "progress enrolled insert" ON public.lms_lesson_progress FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.lms_is_enrolled(auth.uid(), course_slug));
DROP POLICY "subs own insert" ON public.lms_assignment_submissions;
CREATE POLICY "subs enrolled insert" ON public.lms_assignment_submissions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'submitted' AND feedback IS NULL AND public.lms_is_enrolled(auth.uid(), course_slug));
DROP POLICY "plans own insert" ON public.lms_action_plans;
CREATE POLICY "plans enrolled insert" ON public.lms_action_plans FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'submitted' AND public.lms_is_enrolled(auth.uid(), course_slug));
DROP POLICY "assess own insert" ON public.lms_assessment_status;
CREATE POLICY "assess enrolled insert" ON public.lms_assessment_status FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.lms_is_enrolled(auth.uid(), course_slug));

-- Waitlist workflow: admins can update status.
CREATE POLICY "waitlist: admin update" ON public.academy_waitlist FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
GRANT UPDATE ON public.academy_waitlist TO authenticated;

-- Admin enrols a learner by email (optionally from a waitlist entry).
CREATE OR REPLACE FUNCTION public.admin_enrol_learner(_email text, _course_slug text, _cohort text DEFAULT NULL, _waitlist_id uuid DEFAULT NULL)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'auth'
AS $$
DECLARE _uid uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden: admin only'; END IF;
  SELECT id INTO _uid FROM auth.users WHERE lower(email) = lower(trim(_email)) LIMIT 1;
  IF _uid IS NULL THEN RAISE EXCEPTION 'No account found for %. Ask them to sign up first.', _email; END IF;
  INSERT INTO public.lms_course_starts (user_id, course_slug, cohort_name, enrolled_by, waitlist_id)
  VALUES (_uid, _course_slug, NULLIF(trim(_cohort), ''), auth.uid(), _waitlist_id)
  ON CONFLICT (user_id, course_slug) DO UPDATE SET cohort_name = COALESCE(EXCLUDED.cohort_name, lms_course_starts.cohort_name);
  IF _waitlist_id IS NOT NULL THEN
    UPDATE public.academy_waitlist SET status = 'enrolled', user_id = COALESCE(user_id, _uid) WHERE id = _waitlist_id;
  END IF;
  RETURN 'ok';
END $$;
REVOKE ALL ON FUNCTION public.admin_enrol_learner(text, text, text, uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.admin_enrol_learner(text, text, text, uuid) TO authenticated;