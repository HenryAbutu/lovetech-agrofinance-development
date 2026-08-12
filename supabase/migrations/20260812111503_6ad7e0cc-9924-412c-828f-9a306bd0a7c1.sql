GRANT SELECT ON public.blog_posts TO anon;

DROP POLICY IF EXISTS "posts: public read published" ON public.blog_posts;

CREATE POLICY "posts: anon read published"
ON public.blog_posts
FOR SELECT
TO anon
USING (status = 'published'::post_status);

CREATE POLICY "posts: authenticated read published or admin"
ON public.blog_posts
FOR SELECT
TO authenticated
USING (status = 'published'::post_status OR public.has_role(auth.uid(), 'admin'::app_role));