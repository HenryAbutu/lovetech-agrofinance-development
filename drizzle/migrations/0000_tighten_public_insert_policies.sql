DROP POLICY IF EXISTS "diag: public insert" ON public.diagnostic_requests;
CREATE POLICY "diag: public insert" ON public.diagnostic_requests FOR INSERT TO anon, authenticated
WITH CHECK (status = 'new' AND char_length(full_name) BETWEEN 1 AND 200 AND char_length(business_name) BETWEEN 1 AND 200 AND char_length(email) BETWEEN 3 AND 320 AND email LIKE '%@%');

DROP POLICY IF EXISTS "enquiries: public insert" ON public.enquiries;
CREATE POLICY "enquiries: public insert" ON public.enquiries FOR INSERT TO anon, authenticated
WITH CHECK (status = 'new' AND char_length(full_name) BETWEEN 1 AND 200 AND char_length(email) BETWEEN 3 AND 320 AND email LIKE '%@%' AND char_length(message) BETWEEN 1 AND 5000);

DROP POLICY IF EXISTS "waitlist: public insert" ON public.academy_waitlist;
CREATE POLICY "waitlist: public insert" ON public.academy_waitlist FOR INSERT TO anon, authenticated
WITH CHECK (char_length(full_name) BETWEEN 1 AND 200 AND char_length(email) BETWEEN 3 AND 320 AND email LIKE '%@%');

DROP POLICY IF EXISTS "Anyone can submit a booking enquiry" ON public.house8_bookings;
CREATE POLICY "Anyone can submit a booking enquiry" ON public.house8_bookings FOR INSERT TO anon, authenticated
WITH CHECK (status = 'new' AND char_length(full_name) BETWEEN 1 AND 200 AND char_length(email) BETWEEN 3 AND 320 AND email LIKE '%@%' AND (guests IS NULL OR guests BETWEEN 1 AND 50) AND (check_in IS NULL OR check_out IS NULL OR check_out >= check_in));

DROP POLICY IF EXISTS "Anyone can place an order enquiry" ON public.rubychai_orders;
CREATE POLICY "Anyone can place an order enquiry" ON public.rubychai_orders FOR INSERT TO anon, authenticated
WITH CHECK (status = 'new' AND char_length(full_name) BETWEEN 1 AND 200 AND char_length(email) BETWEEN 3 AND 320 AND email LIKE '%@%' AND char_length(phone) BETWEEN 5 AND 40 AND estimated_total >= 0 AND jsonb_typeof(items) = 'array');

DROP POLICY IF EXISTS "Anyone reads badges" ON public.academy_badges;
CREATE POLICY "Anyone reads badges" ON public.academy_badges FOR SELECT TO anon, authenticated
USING (char_length(code) > 0);