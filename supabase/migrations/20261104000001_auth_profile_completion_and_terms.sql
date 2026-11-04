-- ==============================================================================
-- GradEdge Academic Solutions - Profile Completion, Terms & Auth Enhancements
-- Migration: 20261104000001_auth_profile_completion_and_terms.sql
-- ==============================================================================

-- 1. ADD COLUMNS FOR PROFILE COMPLETION AND TERMS TRACKING
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS profile_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS terms_accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS terms_version text DEFAULT '1.0',
  ADD COLUMN IF NOT EXISTS marketing_opt_in boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS timezone text NOT NULL DEFAULT 'UTC';

-- 2. ENSURE STUDY LEVEL CONSTRAINT ENFORCES SPECIFIED ROLES
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_study_level_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_study_level_check
  CHECK (study_level IN ('undergraduate', 'masters', 'phd', 'researcher', 'other'));

-- 3. CREATE INDEX FOR PROFILE COMPLETION STATUS QUERIES
CREATE INDEX IF NOT EXISTS idx_profiles_completed ON public.profiles(profile_completed_at);
CREATE INDEX IF NOT EXISTS idx_profiles_terms ON public.profiles(terms_accepted_at);

