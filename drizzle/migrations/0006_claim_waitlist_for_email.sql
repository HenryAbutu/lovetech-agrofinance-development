CREATE OR REPLACE FUNCTION public.claim_waitlist_for_email(_id uuid)
RETURNS TABLE(full_name text, email text, phone text, business_name text, business_sector text, location text, preferred_training_mode text, main_challenge text, course_interest text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  UPDATE public.academy_waitlist w
     SET emails_sent_at = now()
   WHERE w.id = _id
     AND w.emails_sent_at IS NULL
     AND w.created_at > now() - interval '15 minutes'
  RETURNING w.full_name, w.email, w.phone, w.business_name, w.business_sector, w.location, w.preferred_training_mode, w.main_challenge, COALESCE(w.course_interest, w.interest_area);
END $$;
REVOKE ALL ON FUNCTION public.claim_waitlist_for_email(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.claim_waitlist_for_email(uuid) TO anon, authenticated, service_role;