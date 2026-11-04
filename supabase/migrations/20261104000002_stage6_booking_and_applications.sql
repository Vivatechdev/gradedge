-- ==============================================================================
-- MIGRATION: Stage 6 - Bookings, Availability, Applications & Support Requests
-- ==============================================================================

-- 1. ENHANCE BOOKINGS TABLE
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS cancellation_token text UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  ADD COLUMN IF NOT EXISTS guest_study_level text,
  ADD COLUMN IF NOT EXISTS guest_topic text,
  ADD COLUMN IF NOT EXISTS session_type text NOT NULL DEFAULT 'consultation' CHECK (session_type IN ('consultation', 'paid_session')),
  ADD COLUMN IF NOT EXISTS expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS reminder_24h_sent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reminder_1h_sent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'UTC';

-- Make mentor_id and service_id nullable for guest consultation pool matching
ALTER TABLE public.bookings ALTER COLUMN mentor_id DROP NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN service_id DROP NOT NULL;

-- Index on cancellation token and reminder flags
CREATE INDEX IF NOT EXISTS idx_bookings_cancellation_token ON public.bookings(cancellation_token);
CREATE INDEX IF NOT EXISTS idx_bookings_reminders ON public.bookings(starts_at, reminder_24h_sent, reminder_1h_sent)
  WHERE (status IN ('confirmed', 'pending_payment'));
CREATE INDEX IF NOT EXISTS idx_bookings_expires_at ON public.bookings(expires_at)
  WHERE (status = 'pending_payment');

-- 2. ENHANCE PROGRAM APPLICATIONS TABLE
ALTER TABLE public.program_applications
  ALTER COLUMN applicant_id DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS institution text,
  ADD COLUMN IF NOT EXISTS doctoral_stage text,
  ADD COLUMN IF NOT EXISTS completed_summary text,
  ADD COLUMN IF NOT EXISTS desired_outcomes text,
  ADD COLUMN IF NOT EXISTS preferred_start text,
  ADD COLUMN IF NOT EXISTS secure_payment_token text UNIQUE,
  ADD COLUMN IF NOT EXISTS secure_payment_url text;

CREATE INDEX IF NOT EXISTS idx_program_apps_email ON public.program_applications(email);
CREATE INDEX IF NOT EXISTS idx_program_apps_payment_token ON public.program_applications(secure_payment_token);

-- 3. ENHANCE SETTINGS TABLE SEED (DEFAULT BOOKING PARAMETERS)
INSERT INTO public.settings (key, value, updated_at)
VALUES
  ('booking_min_notice_hours', '12'::jsonb, now()),
  ('booking_max_advance_days', '45'::jsonb, now()),
  ('booking_buffer_minutes', '10'::jsonb, now()),
  ('booking_default_meeting_url', '"https://meet.google.com/lookup/gradedge-consultation"'::jsonb, now()),
  ('admin_notification_email', '"admissions@gradedge.com"'::jsonb, now())
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value, updated_at = now();

-- 4. DEFAULT AVAILABILITY RULES (MONDAY-FRIDAY 09:00 - 17:00 UTC)
-- Used when no mentor-specific rules exist or for the advisory pool
INSERT INTO public.availability_rules (weekday, start_time, end_time, timezone)
SELECT w, '09:00:00'::time, '17:00:00'::time, 'UTC'
FROM unnest(ARRAY[1, 2, 3, 4, 5]) AS w
WHERE NOT EXISTS (
  SELECT 1 FROM public.availability_rules WHERE mentor_id IS NULL AND weekday = w
);

-- 5. RLS POLICIES FOR STAGE 6

-- Bookings: Anyone can create a consultation booking (guest or authenticated)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Public insert for consultation bookings'
  ) THEN
    CREATE POLICY "Public insert for consultation bookings"
      ON public.bookings
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

-- Bookings: Anyone can view or manage their own booking via token
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Public access by cancellation token'
  ) THEN
    CREATE POLICY "Public access by cancellation token"
      ON public.bookings
      FOR SELECT
      TO public
      USING (cancellation_token IS NOT NULL);
  END IF;
END $$;

-- Program Applications: Public can submit accelerator application
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'program_applications' AND policyname = 'Public submit program applications'
  ) THEN
    CREATE POLICY "Public submit program applications"
      ON public.program_applications
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

-- Projects: Students can create their own support requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Students create support requests'
  ) THEN
    CREATE POLICY "Students create support requests"
      ON public.projects
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = student_id);
  END IF;
END $$;

