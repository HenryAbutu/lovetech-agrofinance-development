
-- 1) academy_modules: replace public read-all with enrolled/admin-only
DROP POLICY IF EXISTS "modules: public read" ON public.academy_modules;

CREATE OR REPLACE FUNCTION public.is_enrolled_in_course(_user_id uuid, _course_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.academy_enrolments
    WHERE user_id = _user_id
      AND course_id = _course_id
      AND access_status = 'active'
  )
$$;

REVOKE EXECUTE ON FUNCTION public.is_enrolled_in_course(uuid, uuid) FROM PUBLIC, anon, authenticated;

CREATE POLICY "modules: enrolled or admin read"
  ON public.academy_modules
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR public.is_enrolled_in_course(auth.uid(), course_id)
  );

-- 2) academy_enrolments: defensive INSERT policy (writes go through service role,
-- but this prevents accidental client-side self-approval if RLS path is ever opened).
CREATE POLICY "enrolments: self insert pending only"
  ON public.academy_enrolments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND payment_status = 'pending_payment'
    AND access_status = 'inactive'
  );

-- 3) Lock down trigger-only SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
