
-- LESSONS
CREATE TABLE public.academy_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.academy_modules(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  resource_url TEXT,
  duration_minutes INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_preview BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.academy_lessons TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.academy_lessons TO authenticated;
GRANT ALL ON public.academy_lessons TO service_role;
ALTER TABLE public.academy_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Preview lessons are public"
ON public.academy_lessons FOR SELECT
USING (is_preview = true);

CREATE POLICY "Enrolled learners can view lessons"
ON public.academy_lessons FOR SELECT TO authenticated
USING (public.is_enrolled_in_course(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage lessons"
ON public.academy_lessons FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_academy_lessons_module ON public.academy_lessons(module_id, sort_order);
CREATE INDEX idx_academy_lessons_course ON public.academy_lessons(course_id);

CREATE TRIGGER trg_academy_lessons_updated_at
BEFORE UPDATE ON public.academy_lessons
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- LESSON PROGRESS
CREATE TABLE public.academy_lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.academy_lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT true,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_lesson_progress TO authenticated;
GRANT ALL ON public.academy_lesson_progress TO service_role;
ALTER TABLE public.academy_lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Learners manage own progress"
ON public.academy_lesson_progress FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins view all progress"
ON public.academy_lesson_progress FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_lesson_progress_user_course ON public.academy_lesson_progress(user_id, course_id);

CREATE TRIGGER trg_academy_lesson_progress_updated_at
BEFORE UPDATE ON public.academy_lesson_progress
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- CERTIFICATES
CREATE TABLE public.academy_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  certificate_name TEXT NOT NULL,
  certificate_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'not_eligible',
  certificate_pdf_url TEXT,
  issued_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);
GRANT SELECT ON public.academy_certificates TO authenticated;
GRANT ALL ON public.academy_certificates TO service_role;
ALTER TABLE public.academy_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Learners view own certificates"
ON public.academy_certificates FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage certificates"
ON public.academy_certificates FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_certificates_user ON public.academy_certificates(user_id);

CREATE TRIGGER trg_academy_certificates_updated_at
BEFORE UPDATE ON public.academy_certificates
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
