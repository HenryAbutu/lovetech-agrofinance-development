
-- ==============================================
-- COUPONS
-- ==============================================
CREATE TABLE public.academy_coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL CHECK (kind IN ('percent','fixed')),
  value NUMERIC(12,2) NOT NULL CHECK (value >= 0),
  max_uses INT,
  used_count INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  min_amount NUMERIC(12,2),
  course_id UUID REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  issued_to_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  source TEXT, -- e.g. 'referral', 'promo', 'manual'
  notes TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.academy_coupons TO authenticated;
GRANT ALL ON public.academy_coupons TO service_role;
ALTER TABLE public.academy_coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage coupons"
ON public.academy_coupons FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Learners can read personal coupons issued to them (for their referral rewards panel)
CREATE POLICY "Learners view own personal coupons"
ON public.academy_coupons FOR SELECT TO authenticated
USING (issued_to_user_id = auth.uid());

CREATE TRIGGER trg_academy_coupons_updated_at
BEFORE UPDATE ON public.academy_coupons
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ==============================================
-- REDEMPTIONS
-- ==============================================
CREATE TABLE public.academy_coupon_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID NOT NULL REFERENCES public.academy_coupons(id) ON DELETE CASCADE,
  enrolment_id UUID NOT NULL REFERENCES public.academy_enrolments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  discount_amount NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (coupon_id, enrolment_id)
);
GRANT SELECT ON public.academy_coupon_redemptions TO authenticated;
GRANT ALL ON public.academy_coupon_redemptions TO service_role;
ALTER TABLE public.academy_coupon_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view all redemptions"
ON public.academy_coupon_redemptions FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view own redemptions"
ON public.academy_coupon_redemptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- ==============================================
-- REFERRALS
-- ==============================================
CREATE TABLE public.academy_referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_user_id UUID NOT NULL,
  referred_user_id UUID,
  referred_enrolment_id UUID REFERENCES public.academy_enrolments(id) ON DELETE SET NULL,
  referral_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','converted','rewarded')),
  reward_coupon_id UUID REFERENCES public.academy_coupons(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.academy_referrals TO authenticated;
GRANT ALL ON public.academy_referrals TO service_role;
ALTER TABLE public.academy_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view all referrals"
ON public.academy_referrals FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view own referral rows"
ON public.academy_referrals FOR SELECT TO authenticated
USING (referrer_user_id = auth.uid() OR referred_user_id = auth.uid());

CREATE TRIGGER trg_academy_referrals_updated_at
BEFORE UPDATE ON public.academy_referrals
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ==============================================
-- ENROLMENT + PROFILE FIELDS
-- ==============================================
ALTER TABLE public.academy_enrolments
  ADD COLUMN IF NOT EXISTS coupon_code TEXT,
  ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS referral_code TEXT;

-- Deterministic referral code per profile
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- Backfill existing profiles with a referral code
UPDATE public.profiles
SET referral_code = UPPER(SUBSTR(REPLACE(id::text, '-', ''), 1, 8))
WHERE referral_code IS NULL;

-- Update handle_new_user to assign a referral code on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    UPPER(SUBSTR(REPLACE(NEW.id::text, '-', ''), 1, 8))
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'learner') ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$function$;
