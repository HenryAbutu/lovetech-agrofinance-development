CREATE OR REPLACE FUNCTION public.get_discussion_authors(_ids uuid[])
RETURNS TABLE(id uuid, full_name text, avatar_url text, public_slug text, is_public boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.id, p.full_name, p.avatar_url, p.public_slug, p.is_public
  FROM public.profiles p
  WHERE p.id = ANY(_ids) AND (p.is_public = true OR p.id = auth.uid())
  LIMIT 500
$$;
REVOKE ALL ON FUNCTION public.get_discussion_authors(uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_discussion_authors(uuid[]) TO authenticated;