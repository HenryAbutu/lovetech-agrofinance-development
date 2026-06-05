
-- 1. Create access-links table for sensitive enrolment-only data
CREATE TABLE public.academy_course_access_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid NOT NULL UNIQUE,
  whatsapp_link text,
  zoom_link text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.academy_course_access_links TO authenticated;
GRANT ALL ON public.academy_course_access_links TO service_role;

ALTER TABLE public.academy_course_access_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "access_links: enrolled or admin read"
  ON public.academy_course_access_links
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR public.is_enrolled_in_course(auth.uid(), course_id)
  );

CREATE POLICY "access_links: admin write"
  ON public.academy_course_access_links
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_access_links_updated_at
  BEFORE UPDATE ON public.academy_course_access_links
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. Migrate existing whatsapp_link / zoom_link values, then drop from public table
INSERT INTO public.academy_course_access_links (course_id, whatsapp_link, zoom_link)
SELECT id, whatsapp_link, zoom_link
FROM public.academy_courses
WHERE whatsapp_link IS NOT NULL OR zoom_link IS NOT NULL
ON CONFLICT (course_id) DO NOTHING;

ALTER TABLE public.academy_courses DROP COLUMN whatsapp_link;
ALTER TABLE public.academy_courses DROP COLUMN zoom_link;

-- 3. Allow learners to read their own payment records
CREATE POLICY "payments: own read"
  ON public.academy_payments
  FOR SELECT TO authenticated
  USING (
    lower(user_email) = lower(COALESCE((auth.jwt() ->> 'email'), ''))
    OR enrolment_id IN (
      SELECT id FROM public.academy_enrolments WHERE user_id = auth.uid()
    )
  );
