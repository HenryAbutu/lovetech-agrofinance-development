CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE(id uuid, full_name text, email text, login_methods text[], role text, created_at timestamptz, last_sign_in_at timestamptz, status text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, auth
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'super_admin') THEN
    RAISE EXCEPTION 'Forbidden: super admin only';
  END IF;
  RETURN QUERY
  SELECT u.id,
    COALESCE(NULLIF(p.full_name,''), u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
    COALESCE(u.email, p.email, '')::text,
    COALESCE(ARRAY(SELECT jsonb_array_elements_text(u.raw_app_meta_data->'providers')), ARRAY[COALESCE(u.raw_app_meta_data->>'provider','email')]),
    COALESCE((SELECT CASE r.role::text WHEN 'instructor' THEN 'facilitator' ELSE r.role::text END FROM public.user_roles r WHERE r.user_id = u.id
      ORDER BY CASE r.role WHEN 'super_admin' THEN 1 WHEN 'admin' THEN 2 WHEN 'facilitator' THEN 3 WHEN 'instructor' THEN 3 ELSE 4 END LIMIT 1), 'learner'),
    u.created_at, u.last_sign_in_at,
    CASE WHEN u.banned_until IS NOT NULL AND u.banned_until > now() THEN 'disabled'
         WHEN u.email_confirmed_at IS NOT NULL THEN 'active' ELSE 'unconfirmed' END
  FROM auth.users u LEFT JOIN public.profiles p ON p.id = u.id;
END $$;

CREATE OR REPLACE FUNCTION public.admin_set_user_role(_user_id uuid, _role app_role)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'super_admin') THEN RAISE EXCEPTION 'Forbidden: super admin only'; END IF;
  IF _user_id = auth.uid() THEN RAISE EXCEPTION 'You can''t change your own role.'; END IF;
  DELETE FROM public.user_roles WHERE user_id = _user_id;
  INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, _role);
END $$;

CREATE OR REPLACE FUNCTION public.admin_set_user_disabled(_user_id uuid, _disabled boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'super_admin') THEN RAISE EXCEPTION 'Forbidden: super admin only'; END IF;
  IF _user_id = auth.uid() THEN RAISE EXCEPTION 'You can''t disable your own account.'; END IF;
  UPDATE auth.users SET banned_until = CASE WHEN _disabled THEN now() + interval '100 years' ELSE NULL END WHERE id = _user_id;
END $$;

REVOKE ALL ON FUNCTION public.admin_list_users() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_set_user_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_set_user_disabled(uuid, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_user_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_user_disabled(uuid, boolean) TO authenticated;