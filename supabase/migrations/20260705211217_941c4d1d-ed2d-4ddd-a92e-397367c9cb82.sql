
DROP POLICY IF EXISTS "authenticated can read course-materials" ON storage.objects;

CREATE POLICY "enrolled learners can read course-materials"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'course-materials'
  AND (
    public.has_role(auth.uid(), 'admin')
    OR public.is_enrolled_in_course(
      auth.uid(),
      NULLIF(split_part(name, '/', 1), '')::uuid
    )
  )
);
