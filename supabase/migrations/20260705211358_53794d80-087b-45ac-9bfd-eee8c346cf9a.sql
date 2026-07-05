INSERT INTO public.user_roles (user_id, role)
VALUES ('23725471-04d0-499c-9ffc-a5bc0f74e596', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;