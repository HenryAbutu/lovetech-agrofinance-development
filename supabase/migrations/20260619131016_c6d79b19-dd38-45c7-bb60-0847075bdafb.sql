CREATE POLICY "payments: self insert for own enrolment"
ON public.academy_payments
FOR INSERT
TO authenticated
WITH CHECK (
  enrolment_id IN (
    SELECT id FROM public.academy_enrolments WHERE user_id = auth.uid()
  )
);

CREATE POLICY "payments: self update for own enrolment"
ON public.academy_payments
FOR UPDATE
TO authenticated
USING (
  enrolment_id IN (
    SELECT id FROM public.academy_enrolments WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  enrolment_id IN (
    SELECT id FROM public.academy_enrolments WHERE user_id = auth.uid()
  )
);