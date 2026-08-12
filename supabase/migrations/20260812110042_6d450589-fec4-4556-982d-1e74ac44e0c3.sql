CREATE TABLE IF NOT EXISTS public.rubychai_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  delivery_address TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  estimated_total NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.rubychai_orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rubychai_orders TO authenticated;
GRANT ALL ON public.rubychai_orders TO service_role;

ALTER TABLE public.rubychai_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can place an order enquiry" ON public.rubychai_orders;
CREATE POLICY "Anyone can place an order enquiry"
  ON public.rubychai_orders FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view orders" ON public.rubychai_orders;
CREATE POLICY "Admins can view orders"
  ON public.rubychai_orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update orders" ON public.rubychai_orders;
CREATE POLICY "Admins can update orders"
  ON public.rubychai_orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete orders" ON public.rubychai_orders;
CREATE POLICY "Admins can delete orders"
  ON public.rubychai_orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_rubychai_orders_created_at ON public.rubychai_orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rubychai_orders_status ON public.rubychai_orders (status);

DROP TRIGGER IF EXISTS update_rubychai_orders_updated_at ON public.rubychai_orders;
CREATE TRIGGER update_rubychai_orders_updated_at
  BEFORE UPDATE ON public.rubychai_orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();