
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'learner');
CREATE TYPE public.course_status AS ENUM ('draft', 'enrolment_open', 'coming_soon', 'closed', 'archived');
CREATE TYPE public.enrolment_payment_status AS ENUM ('pending_payment', 'paid', 'failed', 'refunded', 'manual');
CREATE TYPE public.enrolment_access_status AS ENUM ('inactive', 'active', 'revoked');
CREATE TYPE public.video_script_status AS ENUM ('draft', 'ready', 'published');
CREATE TYPE public.post_status AS ENUM ('draft', 'published', 'archived');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  business_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles: own select" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles: own update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles: read own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- ============ SIGNUP TRIGGER ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'learner') ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ UPDATED_AT TRIGGER ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- ============ ENQUIRIES ============
CREATE TABLE public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_name TEXT,
  service_interest TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon, authenticated;
GRANT SELECT, UPDATE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "enquiries: public insert" ON public.enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "enquiries: admin read" ON public.enquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "enquiries: admin update" ON public.enquiries FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ DIAGNOSTIC REQUESTS ============
CREATE TABLE public.diagnostic_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  business_sector TEXT,
  years_in_operation TEXT,
  funding_type_needed TEXT,
  funding_amount_needed TEXT,
  monthly_sales_estimate TEXT,
  registration_status TEXT,
  main_funding_challenge TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.diagnostic_requests TO anon, authenticated;
GRANT SELECT, UPDATE ON public.diagnostic_requests TO authenticated;
GRANT ALL ON public.diagnostic_requests TO service_role;
ALTER TABLE public.diagnostic_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "diag: public insert" ON public.diagnostic_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "diag: admin read" ON public.diagnostic_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "diag: admin update" ON public.diagnostic_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ ACADEMY COURSES ============
CREATE TABLE public.academy_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  subtitle TEXT,
  description TEXT,
  status course_status NOT NULL DEFAULT 'draft',
  regular_price NUMERIC(12,2),
  discount_price NUMERIC(12,2),
  delivery_mode TEXT,
  registration_deadline DATE,
  course_image TEXT,
  zoom_link TEXT,
  whatsapp_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_courses_updated BEFORE UPDATE ON public.academy_courses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
GRANT SELECT ON public.academy_courses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.academy_courses TO authenticated;
GRANT ALL ON public.academy_courses TO service_role;
ALTER TABLE public.academy_courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courses: public read published" ON public.academy_courses FOR SELECT TO anon, authenticated
  USING (status IN ('enrolment_open','coming_soon','closed') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "courses: admin write" ON public.academy_courses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ ACADEMY MODULES ============
CREATE TABLE public.academy_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  module_number INT NOT NULL,
  objective TEXT,
  lesson_summary TEXT,
  exercise TEXT,
  video_script TEXT,
  video_url TEXT,
  resource_link TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.academy_modules TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.academy_modules TO authenticated;
GRANT ALL ON public.academy_modules TO service_role;
ALTER TABLE public.academy_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "modules: public read" ON public.academy_modules FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "modules: admin write" ON public.academy_modules FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ ACADEMY RESOURCES ============
CREATE TABLE public.academy_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES public.academy_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT,
  file_url TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.academy_resources TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.academy_resources TO authenticated;
GRANT ALL ON public.academy_resources TO service_role;
ALTER TABLE public.academy_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "resources: public read public ones" ON public.academy_resources FOR SELECT TO anon, authenticated
  USING (is_public = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "resources: admin write" ON public.academy_resources FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ ACADEMY ENROLMENTS ============
CREATE TABLE public.academy_enrolments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE RESTRICT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_name TEXT,
  business_sector TEXT,
  location TEXT,
  main_challenge TEXT,
  referral_source TEXT,
  payment_status enrolment_payment_status NOT NULL DEFAULT 'pending_payment',
  access_status enrolment_access_status NOT NULL DEFAULT 'inactive',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.academy_enrolments TO authenticated;
GRANT ALL ON public.academy_enrolments TO service_role;
ALTER TABLE public.academy_enrolments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "enrolments: own read" ON public.academy_enrolments FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- ============ ACADEMY PAYMENTS ============
CREATE TABLE public.academy_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrolment_id UUID NOT NULL REFERENCES public.academy_enrolments(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.academy_courses(id),
  user_email TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  payment_provider TEXT NOT NULL DEFAULT 'paystack',
  paystack_reference TEXT,
  status TEXT NOT NULL DEFAULT 'initialised',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.academy_payments TO authenticated;
GRANT ALL ON public.academy_payments TO service_role;
ALTER TABLE public.academy_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payments: admin read" ON public.academy_payments FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- ============ ACADEMY WAITLIST ============
CREATE TABLE public.academy_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.academy_courses(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_name TEXT,
  business_sector TEXT,
  location TEXT,
  interest_area TEXT,
  preferred_training_mode TEXT,
  main_challenge TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.academy_waitlist TO anon, authenticated;
GRANT SELECT ON public.academy_waitlist TO authenticated;
GRANT ALL ON public.academy_waitlist TO service_role;
ALTER TABLE public.academy_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "waitlist: public insert" ON public.academy_waitlist FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "waitlist: admin read" ON public.academy_waitlist FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ============ VIDEO SCRIPT PROMPTS ============
CREATE TABLE public.video_script_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.academy_courses(id) ON DELETE SET NULL,
  module_id UUID REFERENCES public.academy_modules(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  generated_script TEXT,
  status video_script_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.video_script_prompts TO authenticated;
GRANT ALL ON public.video_script_prompts TO service_role;
ALTER TABLE public.video_script_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "video_prompts: admin all" ON public.video_script_prompts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ BLOG POSTS ============
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT,
  excerpt TEXT,
  body TEXT,
  featured_image TEXT,
  status post_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_posts_updated BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts: public read published" ON public.blog_posts FOR SELECT TO anon, authenticated
  USING (status = 'published' OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "posts: admin write" ON public.blog_posts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ SEED COURSES ============
INSERT INTO public.academy_courses (title, slug, subtitle, description, status, regular_price, discount_price, delivery_mode, registration_deadline) VALUES
('Professionals AI Edge', 'professionals-ai-edge',
 'Practical AI tools for more efficient, productive and profitable businesses',
 'A practical AI course for Nigerian business owners, startup founders, MSME operators, consultants, service providers, traders, and professionals who want to use AI to save time, improve marketing, increase sales, serve customers better, structure operations, review pricing, prepare business documents, and improve profitability.',
 'enrolment_open', 10000, 1000, 'Website + Zoom + WhatsApp Learning Community', '2026-06-15'),
('ICSS 2.0 Entrepreneurship Programme', 'icss-2-0-entrepreneurship',
 'Practical entrepreneurship training for MSME growth, finance readiness, green business thinking, and market access',
 'A practical entrepreneurship programme based on the improved ICSS 2.0 framework, supporting MSMEs with business planning, marketing, financial management, green and circular economy awareness, business model improvement, access-to-finance readiness, and practical enterprise growth tools.',
 'coming_soon', NULL, NULL, 'Website + Live Sessions + Practical Assignments', NULL),
('Finance Readiness for MSMEs', 'finance-readiness-msmes',
 'Prepare your business for loans, grants, investments, and partnership funding',
 'A practical programme that helps business owners understand funding requirements, improve business records, define funding needs, prepare documentation, and become more ready for loans, grants, or investment.',
 'coming_soon', NULL, NULL, 'Website + Live Clinic', NULL);
