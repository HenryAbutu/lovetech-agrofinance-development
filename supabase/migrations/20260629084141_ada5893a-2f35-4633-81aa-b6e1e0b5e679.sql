
-- Fix: anon can execute SECURITY DEFINER has_role
-- Rewrite academy_courses public-read policy to not depend on has_role for anon
DROP POLICY IF EXISTS "courses: public read published" ON public.academy_courses;

CREATE POLICY "courses: public read published"
  ON public.academy_courses
  FOR SELECT
  TO anon, authenticated
  USING (status = ANY (ARRAY['enrolment_open'::course_status, 'coming_soon'::course_status, 'closed'::course_status]));

CREATE POLICY "courses: admin read all"
  ON public.academy_courses
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Revoke EXECUTE on has_role from anon/public so it is not callable without sign-in
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Fix: remove client-writable payment policies; payments are written server-side only
DROP POLICY IF EXISTS "payments: self insert for own enrolment" ON public.academy_payments;
DROP POLICY IF EXISTS "payments: self update for own enrolment" ON public.academy_payments;
