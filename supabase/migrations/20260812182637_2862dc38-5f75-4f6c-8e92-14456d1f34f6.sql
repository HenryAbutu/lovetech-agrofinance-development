ALTER TABLE public.house8_bookings ADD COLUMN IF NOT EXISTS room TEXT;

CREATE INDEX IF NOT EXISTS idx_house8_bookings_room ON public.house8_bookings (room);

COMMENT ON COLUMN public.house8_bookings.room IS 'Preferred room at House 8: Diamond, Ruby, Jasmine, Emerald, Pearl, or full house.';
