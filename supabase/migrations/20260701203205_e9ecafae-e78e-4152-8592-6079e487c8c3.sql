
ALTER VIEW public.academy_learner_points SET (security_invoker = true);

REVOKE EXECUTE ON FUNCTION public.is_enrolled_in_course(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_enrolled_in_course(uuid, uuid) TO service_role;
