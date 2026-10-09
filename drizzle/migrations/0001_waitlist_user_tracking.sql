ALTER TABLE public.academy_waitlist
  ADD COLUMN IF NOT EXISTS user_id uuid,
  ADD COLUMN IF NOT EXISTS course_interest text,
  ADD COLUMN IF NOT EXISTS source_page text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new';

CREATE UNIQUE INDEX IF NOT EXISTS academy_waitlist_user_course_uniq
  ON public.academy_waitlist (user_id, course_interest)
  WHERE user_id IS NOT NULL AND course_interest IS NOT NULL;

GRANT INSERT ON public.academy_waitlist TO anon;
GRANT SELECT, INSERT ON public.academy_waitlist TO authenticated;
GRANT ALL ON public.academy_waitlist TO service_role;

DROP POLICY IF EXISTS "waitlist: public insert" ON public.academy_waitlist;
CREATE POLICY "waitlist: public insert" ON public.academy_waitlist
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(full_name) BETWEEN 1 AND 200
    AND char_length(email) BETWEEN 3 AND 320
    AND email LIKE '%@%'
    AND status = 'new'
    AND (user_id IS NULL OR user_id = auth.uid())
  );

DROP POLICY IF EXISTS "waitlist: own read" ON public.academy_waitlist;
CREATE POLICY "waitlist: own read" ON public.academy_waitlist
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());