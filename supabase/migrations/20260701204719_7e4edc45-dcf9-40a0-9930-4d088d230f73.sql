
CREATE POLICY "Users read own invoice files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'invoices'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Admins read all invoice files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'invoices'
  AND public.has_role(auth.uid(), 'admin')
);
