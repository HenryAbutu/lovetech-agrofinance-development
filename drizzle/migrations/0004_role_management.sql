-- super_admin inherits every admin permission (RLS policies + server checks use has_role(...,'admin'))
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND (role = _role OR (_role = 'admin' AND role = 'super_admin'))
  )
$$;

-- The caller's single effective role (highest wins)
CREATE OR REPLACE FUNCTION public.get_my_role()
 RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT COALESCE((
    SELECT role::text FROM public.user_roles WHERE user_id = auth.uid()
    ORDER BY CASE role WHEN 'super_admin' THEN 1 WHEN 'admin' THEN 2 WHEN 'facilitator' THEN 3 WHEN 'instructor' THEN 3 ELSE 4 END
    LIMIT 1), 'learner')
$$;
REVOKE EXECUTE ON FUNCTION public.get_my_role() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;

-- Bootstrap roles for the two owner accounts, on signup too
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, referral_code)
  VALUES (NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    UPPER(SUBSTR(REPLACE(NEW.id::text, '-', ''), 1, 8)))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE lower(NEW.email)
    WHEN 'avessabutu@gmail.com' THEN 'super_admin'::app_role
    WHEN 'info@lovetechgroup.com.ng' THEN 'admin'::app_role
    ELSE 'learner'::app_role END)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

-- Backfill: one profile per existing auth user
INSERT INTO public.profiles (id, email, full_name, referral_code)
SELECT u.id, u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
  UPPER(SUBSTR(REPLACE(u.id::text, '-', ''), 1, 8))
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id);

-- Backfill: every user has at least the learner role
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'learner'::app_role FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = u.id);

-- Backfill: owner roles
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'super_admin'::app_role FROM auth.users u
WHERE lower(u.email) = 'avessabutu@gmail.com'
ON CONFLICT DO NOTHING;
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role FROM auth.users u
WHERE lower(u.email) = 'info@lovetechgroup.com.ng'
ON CONFLICT DO NOTHING;