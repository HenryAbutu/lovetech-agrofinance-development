
-- 1) Lesson discussions
CREATE TABLE public.academy_lesson_discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.academy_lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.academy_lesson_discussions(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lesson_discussions_lesson ON public.academy_lesson_discussions(lesson_id, created_at DESC);
CREATE INDEX idx_lesson_discussions_user ON public.academy_lesson_discussions(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_lesson_discussions TO authenticated;
GRANT ALL ON public.academy_lesson_discussions TO service_role;

ALTER TABLE public.academy_lesson_discussions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled learners read discussions"
  ON public.academy_lesson_discussions FOR SELECT TO authenticated
  USING (
    public.is_enrolled_in_course(auth.uid(), course_id)
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'instructor')
  );

CREATE POLICY "Enrolled learners post discussions"
  ON public.academy_lesson_discussions FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND (
      public.is_enrolled_in_course(auth.uid(), course_id)
      OR public.has_role(auth.uid(), 'admin')
      OR public.has_role(auth.uid(), 'instructor')
    )
  );

CREATE POLICY "Authors edit their own posts"
  ON public.academy_lesson_discussions FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'instructor'))
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'instructor'));

CREATE POLICY "Authors and admins delete posts"
  ON public.academy_lesson_discussions FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_lesson_discussions_updated_at
  BEFORE UPDATE ON public.academy_lesson_discussions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2) Public profile fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS headline TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS website_url TEXT,
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS public_slug TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_profiles_is_public ON public.profiles(is_public) WHERE is_public = true;

DROP POLICY IF EXISTS "Public profiles are readable" ON public.profiles;
CREATE POLICY "Public profiles are readable"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

GRANT SELECT ON public.profiles TO anon;

-- 3) Web Push subscriptions
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_push_subscriptions_user ON public.push_subscriptions(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.push_subscriptions TO authenticated;
GRANT ALL ON public.push_subscriptions TO service_role;

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own push subscriptions"
  ON public.push_subscriptions FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
