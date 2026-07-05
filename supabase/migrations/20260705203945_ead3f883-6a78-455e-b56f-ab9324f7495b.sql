
-- Course materials bucket: admins upload; enrolled learners read
CREATE POLICY "admins manage course-materials"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'course-materials' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'course-materials' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "authenticated can read course-materials"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'course-materials');
