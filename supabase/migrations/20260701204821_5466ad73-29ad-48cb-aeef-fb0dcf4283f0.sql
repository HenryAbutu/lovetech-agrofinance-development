
ALTER TABLE public.academy_payments
  ADD COLUMN IF NOT EXISTS invoice_pdf_url TEXT,
  ADD COLUMN IF NOT EXISTS invoice_number TEXT;
