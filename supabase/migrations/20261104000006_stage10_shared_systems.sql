-- ============================================================================
-- Migration: Stage 10 Shared Systems (Cron Runs, Integrity Flags, Notifications, Email Settings)
-- File: 20261104000006_stage10_shared_systems.sql
-- ============================================================================

-- 1. CRON RUNS TABLE
CREATE TABLE IF NOT EXISTS public.cron_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('running', 'success', 'failed')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_cron_runs_job_status ON public.cron_runs(job_name, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_cron_runs_status ON public.cron_runs(status);

ALTER TABLE public.cron_runs ENABLE ROW LEVEL SECURITY;

-- Admins can view cron runs
DROP POLICY IF EXISTS "Admins can view cron runs" ON public.cron_runs;
CREATE POLICY "Admins can view cron runs" ON public.cron_runs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 2. INTEGRITY FLAGS EXTENSION FOR MESSAGING
-- Allow integrity flags to be attached to messages and threads directly
ALTER TABLE public.integrity_flags ALTER COLUMN project_id DROP NOT NULL;

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'integrity_flags' 
    AND column_name = 'message_id'
  ) THEN 
    ALTER TABLE public.integrity_flags ADD COLUMN message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'integrity_flags' 
    AND column_name = 'thread_id'
  ) THEN 
    ALTER TABLE public.integrity_flags ADD COLUMN thread_id UUID REFERENCES public.message_threads(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'integrity_flags' 
    AND column_name = 'message_excerpt'
  ) THEN 
    ALTER TABLE public.integrity_flags ADD COLUMN message_excerpt TEXT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_integrity_flags_message ON public.integrity_flags(message_id);
CREATE INDEX IF NOT EXISTS idx_integrity_flags_thread ON public.integrity_flags(thread_id);

-- RLS: Authenticated users can raise integrity flags
DROP POLICY IF EXISTS "Users can raise integrity flags" ON public.integrity_flags;
CREATE POLICY "Users can raise integrity flags" ON public.integrity_flags
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = raised_by);

-- 3. NOTIFICATIONS REALTIME PUBLICATION
-- Ensure notifications table is part of the supabase_realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- 4. MESSAGES REALTIME PUBLICATION
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- 5. INITIAL SETTINGS SEED FOR EMAIL CUSTOMIZATION & RESPONSE WINDOWS
INSERT INTO public.settings (key, value, updated_at)
VALUES 
  ('mentor_response_window', '"24 business hours (Monday–Friday, 9:00 AM – 6:00 PM)"'::jsonb, now()),
  ('email_templates', '{
    "welcome": {
      "subject": "Welcome to GradEdge Academic Solutions",
      "intro": "Welcome to GradEdge. Our mission is to support your academic inquiry with methodological rigor, constructive critique, and scholarly integrity."
    },
    "consultation_confirmed": {
      "subject": "Consultation Confirmed: Academic Scoping Session",
      "intro": "Your 20-minute advisory consultation has been confirmed. A calendar invitation is attached for your convenience."
    },
    "accelerator_accepted": {
      "subject": "GradEdge Accelerator: Acceptance & Enrollment Offer",
      "intro": "We are pleased to inform you that your application for the Graduate Accelerator cohort has been approved by the advisory committee."
    },
    "mentor_assigned": {
      "subject": "Mentor Appointed: Welcome to Your Research Guidance",
      "intro": "We have matched your project with an academic mentor whose research specialization aligns with your methodological framework."
    }
  }'::jsonb, now())
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value, updated_at = now();

