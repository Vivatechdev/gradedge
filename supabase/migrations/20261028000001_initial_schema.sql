-- ==============================================================================
-- GradEdge Academic Solutions - Initial Database Schema & RLS Policies
-- Migration: 20261028000001_initial_schema.sql
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 2. HELPER FUNCTIONS

-- Function to handle updated_at timestamp automatically
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. PROFILES TABLE
-- References Supabase auth.users. Role-based access control.
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'mentor', 'admin')),
  full_name text NOT NULL,
  email text NOT NULL,
  avatar_url text,
  institution text NOT NULL DEFAULT '',
  study_level text NOT NULL DEFAULT 'masters' CHECK (study_level IN ('undergraduate', 'masters', 'phd', 'researcher', 'other')),
  field_of_study text NOT NULL DEFAULT '',
  timezone text NOT NULL DEFAULT 'UTC',
  phone text,
  marketing_opt_in boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. MENTORS TABLE (Strictly private: never publicly exposed)
CREATE TABLE IF NOT EXISTS public.mentors (
  profile_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  headline text NOT NULL,
  bio text NOT NULL,
  credentials text NOT NULL,
  disciplines text[] NOT NULL DEFAULT '{}',
  software text[] NOT NULL DEFAULT '{}',
  photo_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_mentors_updated_at BEFORE UPDATE ON public.mentors FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. SERVICES & PACKAGES
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text NOT NULL,
  summary text NOT NULL,
  description text NOT NULL,
  price_from_minor bigint NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  delivery_mode text NOT NULL CHECK (delivery_mode IN ('session', 'project', 'program', 'membership')),
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(is_active, sort_order);
CREATE TRIGGER set_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  price_minor bigint NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  includes text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_packages_service_id ON public.packages(service_id);
CREATE TRIGGER set_packages_updated_at BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. PROJECTS & MILESTONES (Support requests)
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  service_id uuid NOT NULL REFERENCES public.services(id),
  package_id uuid REFERENCES public.packages(id) ON DELETE SET NULL,
  title text NOT NULL,
  brief text NOT NULL,
  status text NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'scoping', 'active', 'on_hold', 'completed', 'cancelled')),
  due_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_student_id ON public.projects(student_id);
CREATE INDEX IF NOT EXISTS idx_projects_mentor_id ON public.projects(mentor_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  due_date date,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON public.milestones(project_id, sort_order);
CREATE TRIGGER set_milestones_updated_at BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 7. AVAILABILITY RULES & EXCEPTIONS
CREATE TABLE IF NOT EXISTS public.availability_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  weekday integer NOT NULL CHECK (weekday >= 0 AND weekday <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  timezone text NOT NULL DEFAULT 'UTC',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS idx_avail_rules_mentor ON public.availability_rules(mentor_id, weekday);
CREATE TRIGGER set_avail_rules_updated_at BEFORE UPDATE ON public.availability_rules FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.availability_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  is_unavailable boolean NOT NULL DEFAULT true,
  start_time time,
  end_time time,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_avail_exceptions_mentor_date ON public.availability_exceptions(mentor_id, date);
CREATE TRIGGER set_avail_exceptions_updated_at BEFORE UPDATE ON public.availability_exceptions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  provider text NOT NULL DEFAULT 'paystack',
  provider_reference text NOT NULL UNIQUE,
  amount_minor bigint NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'succeeded', 'failed', 'refunded')),
  purpose text NOT NULL CHECK (purpose IN ('booking', 'package', 'program', 'membership')),
  related_id uuid,
  raw_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON public.payments(provider_reference);
CREATE TRIGGER set_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. INVOICES TABLE
CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq START 1;

CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  number text NOT NULL UNIQUE,
  pdf_url text,
  issued_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoices_payment_id ON public.invoices(payment_id);
CREATE TRIGGER set_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to auto-format invoice number: GE-YYYY-0001
CREATE OR REPLACE FUNCTION public.format_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
  seq_val int;
  year_str text := to_char(now(), 'YYYY');
BEGIN
  IF NEW.number IS NULL OR NEW.number = '' THEN
    seq_val := nextval('public.invoice_number_seq');
    NEW.number := 'GE-' || year_str || '-' || lpad(seq_val::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_format_invoice_number
BEFORE INSERT ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.format_invoice_number();

-- 10. BOOKINGS TABLE (With exclusion constraint against overlapping bookings)
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_name text,
  guest_email text,
  mentor_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES public.services(id),
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'confirmed', 'completed', 'cancelled', 'no_show')),
  meeting_url text,
  notes text,
  payment_id uuid REFERENCES public.payments(id) ON DELETE SET NULL,
  cancellation_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_booking_time CHECK (ends_at > starts_at)
);

-- Exclusion constraint ensuring one mentor never has overlapping confirmed or pending bookings
ALTER TABLE public.bookings ADD CONSTRAINT no_overlapping_mentor_bookings
EXCLUDE USING gist (
  mentor_id WITH =,
  tstzrange(starts_at, ends_at, '[)') WITH &&
) WHERE (status IN ('pending_payment', 'confirmed'));

CREATE INDEX IF NOT EXISTS idx_bookings_student_id ON public.bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_mentor_id ON public.bookings(mentor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_starts_at ON public.bookings(starts_at);
CREATE TRIGGER set_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 11. MEMBERSHIP PLANS & MEMBERSHIPS
CREATE TABLE IF NOT EXISTS public.membership_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price_minor bigint NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  interval text NOT NULL CHECK (interval IN ('month', 'year')),
  paystack_plan_code text,
  perks text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_membership_plans_updated_at BEFORE UPDATE ON public.membership_plans FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.membership_plans(id),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'cancelled', 'expired')),
  current_period_end timestamptz NOT NULL,
  paystack_subscription_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_memberships_user ON public.memberships(user_id);
CREATE TRIGGER set_memberships_updated_at BEFORE UPDATE ON public.memberships FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 12. PROGRAM APPLICATIONS (Dissertation Accelerator)
CREATE TABLE IF NOT EXISTS public.program_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  program text NOT NULL DEFAULT 'accelerator',
  stage_of_research text NOT NULL,
  topic_summary text NOT NULL,
  goals text NOT NULL,
  availability_notes text,
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'accepted', 'waitlisted', 'declined')),
  admin_notes text,
  cohort_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_program_apps_applicant ON public.program_applications(applicant_id);
CREATE TRIGGER set_program_apps_updated_at BEFORE UPDATE ON public.program_applications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 13. FILES & MESSAGES
CREATE TABLE IF NOT EXISTS public.files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  bucket_path text NOT NULL,
  file_name text NOT NULL,
  mime_type text NOT NULL,
  size_bytes bigint NOT NULL,
  visibility text NOT NULL DEFAULT 'shared_with_mentor' CHECK (visibility IN ('private', 'shared_with_mentor')),
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_files_project_id ON public.files(project_id);
CREATE INDEX IF NOT EXISTS idx_files_owner_id ON public.files(owner_id);
CREATE TRIGGER set_files_updated_at BEFORE UPDATE ON public.files FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.message_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  subject text NOT NULL,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_threads_student ON public.message_threads(student_id);
CREATE INDEX IF NOT EXISTS idx_threads_mentor ON public.message_threads(mentor_id);
CREATE TRIGGER set_message_threads_updated_at BEFORE UPDATE ON public.message_threads FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.message_threads(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body text NOT NULL,
  attachment_file_id uuid REFERENCES public.files(id) ON DELETE SET NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON public.messages(thread_id, created_at);
CREATE TRIGGER set_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 14. LEADS & CONTACT INQUIRIES
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  institution text NOT NULL DEFAULT '',
  study_level text NOT NULL DEFAULT 'masters',
  interest text NOT NULL,
  message text NOT NULL,
  source text NOT NULL DEFAULT 'website',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE TRIGGER set_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 15. FAQS
CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_faqs_published ON public.faqs(is_published, sort_order);
CREATE TRIGGER set_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 16. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  link text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read_at);
CREATE TRIGGER set_notifications_updated_at BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 17. INTEGRITY FLAGS
CREATE TABLE IF NOT EXISTS public.integrity_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  raised_by uuid NOT NULL REFERENCES public.profiles(id),
  reason text NOT NULL,
  severity text NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  resolved_at timestamptz,
  resolution_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_integrity_flags_project ON public.integrity_flags(project_id);
CREATE TRIGGER set_integrity_flags_updated_at BEFORE UPDATE ON public.integrity_flags FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 18. AUDIT LOG
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON public.audit_log(entity, entity_id);
CREATE TRIGGER set_audit_log_updated_at BEFORE UPDATE ON public.audit_log FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 19. SUBJECTS (Including health sciences hierarchy)
CREATE TABLE IF NOT EXISTS public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  parent_id uuid REFERENCES public.subjects(id) ON DELETE SET NULL,
  summary text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subjects_slug ON public.subjects(slug);
CREATE INDEX IF NOT EXISTS idx_subjects_parent ON public.subjects(parent_id);
CREATE TRIGGER set_subjects_updated_at BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 20. BLOG: CATEGORIES, TAGS, POSTS, REVISIONS
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_blog_categories_updated_at BEFORE UPDATE ON public.blog_categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.blog_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_blog_tags_updated_at BEFORE UPDATE ON public.blog_tags FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  standfirst text NOT NULL DEFAULT '',
  body jsonb NOT NULL DEFAULT '{}'::jsonb,
  featured_image_url text,
  category_id uuid REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  published_at timestamptz,
  author_name text NOT NULL DEFAULT 'GradEdge Team',
  reading_time_minutes integer NOT NULL DEFAULT 5,
  seo_title text,
  seo_description text,
  canonical_url text,
  is_featured boolean NOT NULL DEFAULT false,
  related_service_ids uuid[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(status, published_at);
CREATE TRIGGER set_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.blog_post_tags (
  post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, tag_id)
);

CREATE TRIGGER set_blog_post_tags_updated_at BEFORE UPDATE ON public.blog_post_tags FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.blog_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  body jsonb NOT NULL,
  edited_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_blog_revisions_updated_at BEFORE UPDATE ON public.blog_revisions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 21. RESOURCES & GLOSSARY
CREATE TABLE IF NOT EXISTS public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('template', 'guide')),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  file_path text NOT NULL,
  requires_email boolean NOT NULL DEFAULT true,
  is_published boolean NOT NULL DEFAULT true,
  download_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_resources_published ON public.resources(is_published, type);
CREATE TRIGGER set_resources_updated_at BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.glossary_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  term text NOT NULL,
  definition text NOT NULL,
  related_term_ids uuid[] NOT NULL DEFAULT '{}',
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_glossary_published ON public.glossary_terms(is_published, slug);
CREATE TRIGGER set_glossary_updated_at BEFORE UPDATE ON public.glossary_terms FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 22. NEWSLETTER & WORKSHOPS
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'unsubscribed')),
  source text NOT NULL DEFAULT 'website',
  confirm_token text,
  confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_status ON public.newsletter_subscribers(status);
CREATE TRIGGER set_newsletter_updated_at BEFORE UPDATE ON public.newsletter_subscribers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.workshop_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL,
  expected_attendees integer,
  topics text NOT NULL,
  preferred_dates text NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workshop_status ON public.workshop_requests(status);
CREATE TRIGGER set_workshops_updated_at BEFORE UPDATE ON public.workshop_requests FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 23. STUDENT STORIES
CREATE TABLE IF NOT EXISTS public.student_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  headline text NOT NULL,
  summary text NOT NULL,
  body text NOT NULL,
  student_display_name text NOT NULL,
  study_level text NOT NULL,
  is_published boolean NOT NULL DEFAULT false,
  consent_confirmed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_student_stories ON public.student_stories(is_published, consent_confirmed);
CREATE TRIGGER set_student_stories_updated_at BEFORE UPDATE ON public.student_stories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 24. SETTINGS
CREATE TABLE IF NOT EXISTS public.settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrity_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- Students can read & update only their own profile. Admins can view/edit all.
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins full access to profiles"
ON public.profiles FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Users can read own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- MENTORS POLICIES (Strictly private: never publicly exposed)
-- Mentors are never publicly readable.
-- Mentors can view/edit their own record.
-- Admins can view/edit all mentors.
-- Assigned students can read through the assigned_mentors view or policy.
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins full access to mentors"
ON public.mentors FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Mentors can read own mentor profile"
ON public.mentors FOR SELECT
TO authenticated
USING (auth.uid() = profile_id);

CREATE POLICY "Assigned students can read matched mentor record"
ON public.mentors FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.mentor_id = mentors.profile_id AND projects.student_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.mentor_id = mentors.profile_id AND bookings.student_id = auth.uid()
  )
);

-- Secure view exposing only limited mentor details to assigned students:
CREATE OR REPLACE VIEW public.assigned_mentors WITH (security_invoker = true) AS
SELECT
  m.profile_id,
  split_part(p.full_name, ' ', 1) AS first_name,
  m.photo_url,
  m.bio,
  m.disciplines,
  m.software
FROM public.mentors m
JOIN public.profiles p ON p.id = m.profile_id;

-- ------------------------------------------------------------------------------
-- PUBLIC CATALOG POLICIES: Services, Packages, Subjects, FAQs, Blog, Resources, Stories
-- ------------------------------------------------------------------------------
CREATE POLICY "Public read active services"
ON public.services FOR SELECT
TO anon, authenticated
USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins manage services"
ON public.services FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Public read active packages"
ON public.packages FOR SELECT
TO anon, authenticated
USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins manage packages"
ON public.packages FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Public read published subjects"
ON public.subjects FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins manage subjects"
ON public.subjects FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Public read published faqs"
ON public.faqs FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins manage faqs"
ON public.faqs FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Public read blog categories"
ON public.blog_categories FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins manage blog categories"
ON public.blog_categories FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Public read blog tags"
ON public.blog_tags FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins manage blog tags"
ON public.blog_tags FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Public read published blog posts"
ON public.blog_posts FOR SELECT
TO anon, authenticated
USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins manage blog posts"
ON public.blog_posts FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Public read blog post tags"
ON public.blog_post_tags FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins manage blog post tags"
ON public.blog_post_tags FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins manage blog revisions"
ON public.blog_revisions FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Public read published resources"
ON public.resources FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins manage resources"
ON public.resources FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Public read published glossary terms"
ON public.glossary_terms FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins manage glossary terms"
ON public.glossary_terms FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Public read published stories with confirmed consent"
ON public.student_stories FOR SELECT
TO anon, authenticated
USING ((is_published = true AND consent_confirmed = true) OR public.is_admin());

CREATE POLICY "Admins manage student stories"
ON public.student_stories FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- PUBLIC SUBMISSION POLICIES: Leads, Newsletter, Workshop Requests
-- Public can insert only. Admins can read & manage all.
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can submit leads"
ON public.leads FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins manage leads"
ON public.leads FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Public can subscribe to newsletter"
ON public.newsletter_subscribers FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins manage newsletter subscribers"
ON public.newsletter_subscribers FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Public can request workshops"
ON public.workshop_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins manage workshop requests"
ON public.workshop_requests FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- PROJECTS & MILESTONES POLICIES
-- Students see only their own projects. Admins see all. Mentors see assigned projects.
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins manage all projects"
ON public.projects FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Students view own projects"
ON public.projects FOR SELECT
TO authenticated
USING (student_id = auth.uid());

CREATE POLICY "Students insert own projects"
ON public.projects FOR INSERT
TO authenticated
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Assigned mentors view projects"
ON public.projects FOR SELECT
TO authenticated
USING (mentor_id = auth.uid());

CREATE POLICY "Admins manage all milestones"
ON public.milestones FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Students view milestones for their projects"
ON public.milestones FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = milestones.project_id AND projects.student_id = auth.uid()
  )
);

CREATE POLICY "Mentors view milestones for assigned projects"
ON public.milestones FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = milestones.project_id AND projects.mentor_id = auth.uid()
  )
);

-- ------------------------------------------------------------------------------
-- AVAILABILITY RULES & EXCEPTIONS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Anyone authenticated can view availability rules"
ON public.availability_rules FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins manage availability rules"
ON public.availability_rules FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Anyone authenticated can view availability exceptions"
ON public.availability_exceptions FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins manage availability exceptions"
ON public.availability_exceptions FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- BOOKINGS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins manage all bookings"
ON public.bookings FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Students view own bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (student_id = auth.uid());

CREATE POLICY "Students insert own bookings"
ON public.bookings FOR INSERT
TO authenticated
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Guests can create pending bookings"
ON public.bookings FOR INSERT
TO anon
WITH CHECK (student_id IS NULL AND status = 'pending_payment');

CREATE POLICY "Mentors view assigned bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (mentor_id = auth.uid());

-- ------------------------------------------------------------------------------
-- PAYMENTS & INVOICES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins manage all payments"
ON public.payments FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Students view own payments"
ON public.payments FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins manage all invoices"
ON public.invoices FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Students view own invoices"
ON public.invoices FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.payments
    WHERE payments.id = invoices.payment_id AND payments.user_id = auth.uid()
  )
);

-- ------------------------------------------------------------------------------
-- MEMBERSHIP PLANS & MEMBERSHIPS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public read active membership plans"
ON public.membership_plans FOR SELECT
TO anon, authenticated
USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins manage membership plans"
ON public.membership_plans FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins manage memberships"
ON public.memberships FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Users view own membership"
ON public.memberships FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- ------------------------------------------------------------------------------
-- PROGRAM APPLICATIONS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins manage all applications"
ON public.program_applications FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Applicants view own applications"
ON public.program_applications FOR SELECT
TO authenticated
USING (applicant_id = auth.uid());

CREATE POLICY "Applicants submit application"
ON public.program_applications FOR INSERT
TO authenticated
WITH CHECK (applicant_id = auth.uid());

-- ------------------------------------------------------------------------------
-- FILES & MESSAGES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins manage all files"
ON public.files FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Owners view own files"
ON public.files FOR SELECT
TO authenticated
USING (owner_id = auth.uid());

CREATE POLICY "Owners upload files"
ON public.files FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Mentors view shared project files"
ON public.files FOR SELECT
TO authenticated
USING (
  visibility = 'shared_with_mentor'
  AND EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = files.project_id AND projects.mentor_id = auth.uid()
  )
);

CREATE POLICY "Admins manage threads"
ON public.message_threads FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Participants view threads"
ON public.message_threads FOR SELECT
TO authenticated
USING (student_id = auth.uid() OR mentor_id = auth.uid());

CREATE POLICY "Admins manage messages"
ON public.messages FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Participants view messages in thread"
ON public.messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.message_threads
    WHERE message_threads.id = messages.thread_id
    AND (message_threads.student_id = auth.uid() OR message_threads.mentor_id = auth.uid())
  )
);

CREATE POLICY "Participants send messages"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.message_threads
    WHERE message_threads.id = messages.thread_id
    AND (message_threads.student_id = auth.uid() OR message_threads.mentor_id = auth.uid())
  )
);

-- ------------------------------------------------------------------------------
-- NOTIFICATIONS, INTEGRITY FLAGS, AUDIT LOG, SETTINGS
-- ------------------------------------------------------------------------------
CREATE POLICY "Users view own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins manage notifications"
ON public.notifications FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins manage integrity flags"
ON public.integrity_flags FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Mentors can raise integrity flags"
ON public.integrity_flags FOR INSERT
TO authenticated
WITH CHECK (raised_by = auth.uid());

CREATE POLICY "Admins view audit log"
ON public.audit_log FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Public read settings"
ON public.settings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins manage settings"
ON public.settings FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ==============================================================================
-- STORAGE BUCKETS SETUP & POLICIES
-- ==============================================================================

-- 1. Insert Buckets into storage.buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('blog-media', 'blog-media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('resources', 'resources', false, 52428800, NULL),
  ('project-files', 'project-files', false, 26214400, ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'application/x-spss-sav',
    'application/octet-stream',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/png',
    'image/jpeg',
    'application/zip',
    'application/x-zip-compressed'
  ]),
  ('invoices', 'invoices', false, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage Objects RLS Policies

-- avatars: public read; authenticated user upload their own avatar
CREATE POLICY "Public view avatars"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'avatars');

CREATE POLICY "Users upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- blog-media: public read; admin manage
CREATE POLICY "Public view blog media"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'blog-media');

CREATE POLICY "Admins manage blog media"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'blog-media' AND public.is_admin())
WITH CHECK (bucket_id = 'blog-media' AND public.is_admin());

-- resources: private (served via signed URL after email capture)
CREATE POLICY "Admins manage resources storage"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'resources' AND public.is_admin())
WITH CHECK (bucket_id = 'resources' AND public.is_admin());

-- project-files: private (signed URLs, accessed by project owner, assigned mentor, admin)
CREATE POLICY "Project files access"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'project-files'
  AND (
    public.is_admin()
    OR auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1 FROM public.projects
      JOIN public.files ON files.project_id = projects.id
      WHERE files.bucket_path = name
      AND (projects.student_id = auth.uid() OR projects.mentor_id = auth.uid())
    )
  )
);

CREATE POLICY "Project files upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-files'
  AND (public.is_admin() OR auth.uid()::text = (storage.foldername(name))[1])
);

-- invoices: private (admin or user for that invoice)
CREATE POLICY "Invoices access"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'invoices'
  AND (
    public.is_admin()
    OR auth.uid()::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Admins upload invoices"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'invoices' AND public.is_admin());

