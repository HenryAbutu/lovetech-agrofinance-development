DROP POLICY IF EXISTS "Public profiles are readable" ON public.profiles;
REVOKE ALL ON public.profiles FROM anon;
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (full_name, display_name, phone, business_name, headline, bio, location, avatar_url, website_url, is_public, public_slug, leaderboard_opt_in) ON public.profiles TO authenticated;

CREATE OR REPLACE FUNCTION public.list_public_learners()
RETURNS TABLE(full_name text, headline text, location text, avatar_url text, public_slug text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT p.full_name, p.headline, p.location, p.avatar_url, p.public_slug
  FROM public.profiles p
  WHERE p.is_public AND p.public_slug IS NOT NULL
  ORDER BY p.full_name LIMIT 100
$$;

CREATE OR REPLACE FUNCTION public.get_public_learner(_slug text)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT jsonb_build_object(
    'profile', jsonb_build_object('full_name', p.full_name, 'headline', p.headline, 'bio', p.bio, 'location', p.location,
      'avatar_url', p.avatar_url, 'website_url', p.website_url, 'public_slug', p.public_slug),
    'badges', COALESCE((SELECT jsonb_agg(jsonb_build_object('badge', jsonb_build_object('id', b.id, 'name', b.name, 'description', b.description)))
      FROM public.academy_learner_badges lb JOIN public.academy_badges b ON b.id = lb.badge_id WHERE lb.user_id = p.id), '[]'::jsonb),
    'certificates', COALESCE((SELECT jsonb_agg(jsonb_build_object('id', c.id, 'certificate_id', c.certificate_id, 'issued_at', c.issued_at,
        'course', jsonb_build_object('title', co.title, 'slug', co.slug)) ORDER BY c.issued_at DESC)
      FROM public.academy_certificates c JOIN public.academy_courses co ON co.id = c.course_id
      WHERE c.user_id = p.id AND c.status = 'issued'), '[]'::jsonb))
  FROM public.profiles p
  WHERE p.public_slug = lower(_slug) AND p.is_public
$$;

REVOKE ALL ON FUNCTION public.list_public_learners() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_public_learner(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_public_learners() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_learner(text) TO anon, authenticated;