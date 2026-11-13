-- ==============================================================================
-- MIGRATION: Stage 8 - Student Dashboard, Files, Messaging & Mentorship
-- ==============================================================================

-- 1. ENHANCE FILES TABLE
ALTER TABLE public.files
  ADD COLUMN IF NOT EXISTS version_label text NOT NULL DEFAULT 'v1.0',
  ADD COLUMN IF NOT EXISTS notes text;

CREATE INDEX IF NOT EXISTS idx_files_owner_id ON public.files(owner_id);
CREATE INDEX IF NOT EXISTS idx_files_project_id ON public.files(project_id);

-- 2. ENHANCE PROFILES TABLE FOR SETTINGS & PREFERENCES
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notification_preferences jsonb NOT NULL DEFAULT '{
    "email_sessions": true,
    "email_messages": true,
    "email_billing": true,
    "marketing": false
  }'::jsonb;

-- 3. MENTOR CHANGE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.mentor_change_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_mentor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  reason text NOT NULL,
  preferred_disciplines text[] NOT NULL DEFAULT '{}',
  additional_notes text,
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'resolved', 'declined')),
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mentor_change_student ON public.mentor_change_requests(student_id);

-- 4. SEED BUSINESS CONFIGURATIONS IN SETTINGS
INSERT INTO public.settings (key, value, updated_at)
VALUES
  ('mentor_matching_window', '"48 business hours"'::jsonb, now()),
  ('mentor_response_window', '"24 business hours (Monday–Friday, 9:00 AM – 6:00 PM)"'::jsonb),
  ('data_export_retention_days', '30'::jsonb, now())
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value, updated_at = now();

-- 5. RLS POLICIES FOR STAGE 8

-- Files: Students manage their own files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'files' AND policyname = 'Students manage own files'
  ) THEN
    CREATE POLICY "Students manage own files"
      ON public.files
      FOR ALL
      TO authenticated
      USING (auth.uid() = owner_id)
      WITH CHECK (auth.uid() = owner_id);
  END IF;
END $$;

-- Message Threads: Students view and participate in their threads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'message_threads' AND policyname = 'Students view own threads'
  ) THEN
    CREATE POLICY "Students view own threads"
      ON public.message_threads
      FOR ALL
      TO authenticated
      USING (auth.uid() = student_id)
      WITH CHECK (auth.uid() = student_id);
  END IF;
END $$;

-- Messages: Students view and insert messages in their threads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Students manage thread messages'
  ) THEN
    CREATE POLICY "Students manage thread messages"
      ON public.messages
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.message_threads t
          WHERE t.id = messages.thread_id AND t.student_id = auth.uid()
        )
      )
      WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
          SELECT 1 FROM public.message_threads t
          WHERE t.id = messages.thread_id AND t.student_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Mentor Change Requests: Students insert and view their requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'mentor_change_requests' AND policyname = 'Students view own mentor change requests'
  ) THEN
    CREATE POLICY "Students view own mentor change requests"
      ON public.mentor_change_requests
      FOR SELECT
      TO authenticated
      USING (auth.uid() = student_id);

    CREATE POLICY "Students create mentor change requests"
      ON public.mentor_change_requests
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = student_id);
  END IF;
END $$;

