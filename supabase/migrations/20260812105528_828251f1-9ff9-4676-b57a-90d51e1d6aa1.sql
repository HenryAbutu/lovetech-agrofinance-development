CREATE TABLE IF NOT EXISTS public.house8_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  apartment_type TEXT,
  check_in DATE,
  check_out DATE,
  guests INTEGER,
  purpose TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.house8_bookings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.house8_bookings TO authenticated;
GRANT ALL ON public.house8_bookings TO service_role;

ALTER TABLE public.house8_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a booking enquiry" ON public.house8_bookings;
CREATE POLICY "Anyone can submit a booking enquiry"
  ON public.house8_bookings FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view booking enquiries" ON public.house8_bookings;
CREATE POLICY "Admins can view booking enquiries"
  ON public.house8_bookings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update booking enquiries" ON public.house8_bookings;
CREATE POLICY "Admins can update booking enquiries"
  ON public.house8_bookings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete booking enquiries" ON public.house8_bookings;
CREATE POLICY "Admins can delete booking enquiries"
  ON public.house8_bookings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_house8_bookings_created_at ON public.house8_bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_house8_bookings_status ON public.house8_bookings (status);

DROP TRIGGER IF EXISTS update_house8_bookings_updated_at ON public.house8_bookings;
CREATE TRIGGER update_house8_bookings_updated_at
  BEFORE UPDATE ON public.house8_bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();