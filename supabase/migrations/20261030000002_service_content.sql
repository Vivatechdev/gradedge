-- Migration: Service Content and Rich Editorial Metadata
-- Extends the GradEdge services system to support rich editable content without code deployment.

CREATE TABLE IF NOT EXISTS public.service_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES public.services(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  hero_image text NOT NULL,
  hero_summary text NOT NULL,
  two_sentence_promise text NOT NULL,
  who_its_for text[] NOT NULL DEFAULT '{}',
  signs_you_need_this text[] NOT NULL DEFAULT '{}',
  outcomes text[] NOT NULL DEFAULT '{}',
  deliverables jsonb NOT NULL DEFAULT '[]',
  process_steps jsonb NOT NULL DEFAULT '[]',
  sample_feedback jsonb NOT NULL DEFAULT '{}',
  software_tools text[] NOT NULL DEFAULT '{}',
  turnaround_text text NOT NULL,
  format_text text NOT NULL,
  best_for text NOT NULL DEFAULT 'Graduate Researchers',
  what_we_wont_do text[] NOT NULL DEFAULT '{}',
  faqs jsonb NOT NULL DEFAULT '[]',
  related_service_slugs text[] NOT NULL DEFAULT '{}',
  related_post_slugs text[] NOT NULL DEFAULT '{}',
  packages jsonb NOT NULL DEFAULT '[]',
  seo jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_content_slug ON public.service_content(slug);

ALTER TABLE public.service_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to service_content"
  ON public.service_content
  FOR SELECT
  USING (true);

CREATE POLICY "Allow service_role full access to service_content"
  ON public.service_content
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

