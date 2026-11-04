-- ==============================================================================
-- MIGRATION: Stage 7 - Payments with Paystack, Invoicing & Subscriptions
-- ==============================================================================

-- 1. ENHANCE PAYMENTS TABLE
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS customer_name text,
  ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS installment_total integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS installment_number integer NOT NULL DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);

-- 2. ENHANCE INVOICES TABLE
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS amount_minor bigint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS customer_name text,
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS items jsonb NOT NULL DEFAULT '[]'::jsonb;

-- 3. SEED BUSINESS DETAILS IN SETTINGS FOR INVOICING
INSERT INTO public.settings (key, value, updated_at)
VALUES
  ('business_legal_name', '"GradEdge Academic Solutions Ltd"'::jsonb, now()),
  ('business_address', '"Level 4, Academic Innovation Hub, Victoria Island, Lagos & Oxford Advisory Desk"'::jsonb, now()),
  ('business_tax_id', '"TIN-GE-2026-9481"'::jsonb, now()),
  ('business_finance_email', '"finance@gradedge.com"'::jsonb, now()),
  ('business_phone', '"+234 1 800 GRADEDGE"'::jsonb, now()),
  ('refund_policy_url', '"https://gradedge.com/legal/terms#refunds"'::jsonb, now())
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value, updated_at = now();

-- 4. SEED STANDARD MEMBERSHIP PLANS IF NOT PRESENT
INSERT INTO public.membership_plans (id, name, description, price_minor, currency, interval, perks, is_active)
VALUES
  (
    '00000000-0000-0000-0001-000000000001',
    'Scholar Membership (USD)',
    'Continuous monthly dissertation coaching, weekly written critique, and priority advisor access.',
    9500, -- $95.00 in minor units (cents)
    'USD',
    'month',
    ARRAY['Up to 2 written draft critiques per month', 'Dedicated discipline advisor', 'Monthly 60-minute methodology call', 'Private workspace and code repo audit'],
    true
  ),
  (
    '00000000-0000-0000-0001-000000000002',
    'Scholar Membership (NGN)',
    'Continuous monthly dissertation coaching, weekly written critique, and priority advisor access.',
    4500000, -- ₦45,000.00 in minor units (kobo)
    'NGN',
    'month',
    ARRAY['Up to 2 written draft critiques per month', 'Dedicated discipline advisor', 'Monthly 60-minute methodology call', 'Private workspace and code repo audit'],
    true
  ),
  (
    '00000000-0000-0000-0001-000000000003',
    'Doctoral Fellow Membership (USD)',
    'Intensive dissertation completion suite with bi-weekly live coaching and unlimited syntax audits.',
    18000, -- $180.00 in minor units (cents)
    'USD',
    'month',
    ARRAY['Bi-weekly 60-minute video coaching calls', 'Line-level developmental review across all chapters', 'Statistical syntax auditing (R, Python, SPSS, Stata)', 'Pre-defense mock viva clearance'],
    true
  ),
  (
    '00000000-0000-0000-0001-000000000004',
    'Doctoral Fellow Membership (NGN)',
    'Intensive dissertation completion suite with bi-weekly live coaching and unlimited syntax audits.',
    8500000, -- ₦85,000.00 in minor units (kobo)
    'NGN',
    'month',
    ARRAY['Bi-weekly 60-minute video coaching calls', 'Line-level developmental review across all chapters', 'Statistical syntax auditing (R, Python, SPSS, Stata)', 'Pre-defense mock viva clearance'],
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 5. RLS POLICIES FOR PAYMENTS AND INVOICES

-- Payments: Students view their own payments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Students view own payments'
  ) THEN
    CREATE POLICY "Students view own payments"
      ON public.payments
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Invoices: Students view invoices linked to their payments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'invoices' AND policyname = 'Students view own invoices'
  ) THEN
    CREATE POLICY "Students view own invoices"
      ON public.invoices
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.payments p
          WHERE p.id = invoices.payment_id AND p.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Service role full access on payments and invoices
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Service role full payments'
  ) THEN
    CREATE POLICY "Service role full payments"
      ON public.payments
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'invoices' AND policyname = 'Service role full invoices'
  ) THEN
    CREATE POLICY "Service role full invoices"
      ON public.invoices
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;


-- 6. STORAGE POLICIES FOR INVOICES BUCKET
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Authenticated students view own invoices'
  ) THEN
    CREATE POLICY "Authenticated students view own invoices"
      ON storage.objects
      FOR SELECT
      TO authenticated
      USING (
        bucket_id = 'invoices' AND
        EXISTS (
          SELECT 1 FROM public.invoices inv
          JOIN public.payments p ON p.id = inv.payment_id
          WHERE p.user_id = auth.uid() AND (inv.pdf_url = name OR inv.number || '.pdf' = name)
        )
      );
  END IF;
END $$;
