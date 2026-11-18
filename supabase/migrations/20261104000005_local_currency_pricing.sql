-- ============================================================================
-- Migration: Stage 9 Local-Currency Pricing Schema & Canonical Prices
-- File: 20261104000005_local_currency_pricing.sql
-- ============================================================================

-- 1. Create the prices table
CREATE TABLE IF NOT EXISTS public.prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('service_package', 'membership_plan', 'session', 'accelerator')),
  currency TEXT NOT NULL CHECK (currency IN ('USD', 'NGN', 'GBP', 'EUR', 'GHS', 'ZAR', 'KES')),
  amount_minor BIGINT NOT NULL CHECK (amount_minor >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (item_id, currency)
);

-- Index for fast lookup by item_id and currency
CREATE INDEX IF NOT EXISTS idx_prices_item_currency ON public.prices(item_id, currency);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Anyone (anon and authenticated) can read active prices
DROP POLICY IF EXISTS "Public can view prices" ON public.prices;
CREATE POLICY "Public can view prices" ON public.prices
  FOR SELECT
  USING (true);

-- Only administrators can insert, update, or delete prices
DROP POLICY IF EXISTS "Admins can manage prices" ON public.prices;
CREATE POLICY "Admins can manage prices" ON public.prices
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 4. Seed Canonical Prices for Core Items across all 7 currencies
-- Minor units: 100 minor units = 1 major unit (cents, kobo, pesewas, etc.)

-- Item: 60-Minute Academic Mentoring Session ('session-60')
INSERT INTO public.prices (item_id, item_type, currency, amount_minor) VALUES
  ('session-60', 'session', 'USD', 7500),      -- $75.00
  ('session-60', 'session', 'NGN', 3500000),   -- ₦35,000
  ('session-60', 'session', 'GBP', 6000),      -- £60.00
  ('session-60', 'session', 'EUR', 7000),      -- €70.00
  ('session-60', 'session', 'GHS', 110000),    -- GH₵1,100
  ('session-60', 'session', 'ZAR', 135000),    -- R1,350
  ('session-60', 'session', 'KES', 950000)     -- KSh 9,500
ON CONFLICT (item_id, currency) DO UPDATE SET amount_minor = EXCLUDED.amount_minor;

-- Item: 12-Week Doctoral Accelerator Full Tuition ('accelerator-full')
INSERT INTO public.prices (item_id, item_type, currency, amount_minor) VALUES
  ('accelerator-full', 'accelerator', 'USD', 120000),    -- $1,200.00
  ('accelerator-full', 'accelerator', 'NGN', 120000000), -- ₦1,200,000
  ('accelerator-full', 'accelerator', 'GBP', 95000),     -- £950.00
  ('accelerator-full', 'accelerator', 'EUR', 110000),    -- €1,100.00
  ('accelerator-full', 'accelerator', 'GHS', 1800000),   -- GH₵18,000
  ('accelerator-full', 'accelerator', 'ZAR', 2200000),   -- R22,000
  ('accelerator-full', 'accelerator', 'KES', 15500000)   -- KSh 155,000
ON CONFLICT (item_id, currency) DO UPDATE SET amount_minor = EXCLUDED.amount_minor;

-- Item: 12-Week Doctoral Accelerator Installment (Part 1 of 3) ('accelerator-installment')
INSERT INTO public.prices (item_id, item_type, currency, amount_minor) VALUES
  ('accelerator-installment', 'accelerator', 'USD', 40000),   -- $400.00
  ('accelerator-installment', 'accelerator', 'NGN', 40000000),-- ₦400,000
  ('accelerator-installment', 'accelerator', 'GBP', 32000),   -- £320.00
  ('accelerator-installment', 'accelerator', 'EUR', 37000),   -- €370.00
  ('accelerator-installment', 'accelerator', 'GHS', 600000),  -- GH₵6,000
  ('accelerator-installment', 'accelerator', 'ZAR', 740000),  -- R7,400
  ('accelerator-installment', 'accelerator', 'KES', 5200000)  -- KSh 52,000
ON CONFLICT (item_id, currency) DO UPDATE SET amount_minor = EXCLUDED.amount_minor;

-- Item: Monthly Membership — Scholar Plan ('scholar')
INSERT INTO public.prices (item_id, item_type, currency, amount_minor) VALUES
  ('scholar', 'membership_plan', 'USD', 9500),     -- $95.00 / mo
  ('scholar', 'membership_plan', 'NGN', 4500000),  -- ₦45,000 / mo
  ('scholar', 'membership_plan', 'GBP', 7500),     -- £75.00 / mo
  ('scholar', 'membership_plan', 'EUR', 8800),     -- €88.00 / mo
  ('scholar', 'membership_plan', 'GHS', 145000),   -- GH₵1,450 / mo
  ('scholar', 'membership_plan', 'ZAR', 175000),   -- R1,750 / mo
  ('scholar', 'membership_plan', 'KES', 1250000)   -- KSh 12,500 / mo
ON CONFLICT (item_id, currency) DO UPDATE SET amount_minor = EXCLUDED.amount_minor;

-- Item: Monthly Membership — Fellow Plan ('fellow')
INSERT INTO public.prices (item_id, item_type, currency, amount_minor) VALUES
  ('fellow', 'membership_plan', 'USD', 18000),    -- $180.00 / mo
  ('fellow', 'membership_plan', 'NGN', 8500000),  -- ₦85,000 / mo
  ('fellow', 'membership_plan', 'GBP', 14000),    -- £140.00 / mo
  ('fellow', 'membership_plan', 'EUR', 16500),    -- €165.00 / mo
  ('fellow', 'membership_plan', 'GHS', 275000),   -- GH₵2,750 / mo
  ('fellow', 'membership_plan', 'ZAR', 330000),   -- R3,300 / mo
  ('fellow', 'membership_plan', 'KES', 2350000)   -- KSh 23,500 / mo
ON CONFLICT (item_id, currency) DO UPDATE SET amount_minor = EXCLUDED.amount_minor;

-- Item: Core Service Packages
-- Package: Dissertation Support — Proposal Architecture
INSERT INTO public.prices (item_id, item_type, currency, amount_minor) VALUES
  ('proposal-architecture', 'service_package', 'USD', 45000),    -- $450.00
  ('proposal-architecture', 'service_package', 'NGN', 25000000), -- ₦250,000
  ('proposal-architecture', 'service_package', 'GBP', 36000),    -- £360.00
  ('proposal-architecture', 'service_package', 'EUR', 42000),    -- €420.00
  ('proposal-architecture', 'service_package', 'GHS', 700000),   -- GH₵7,000
  ('proposal-architecture', 'service_package', 'ZAR', 820000),   -- R8,200
  ('proposal-architecture', 'service_package', 'KES', 5800000)   -- KSh 58,000
ON CONFLICT (item_id, currency) DO UPDATE SET amount_minor = EXCLUDED.amount_minor;

-- Package: Dissertation Support — Doctoral Completion Suite
INSERT INTO public.prices (item_id, item_type, currency, amount_minor) VALUES
  ('doctoral-completion-suite', 'service_package', 'USD', 120000),   -- $1,200.00
  ('doctoral-completion-suite', 'service_package', 'NGN', 75000000), -- ₦750,000
  ('doctoral-completion-suite', 'service_package', 'GBP', 95000),    -- £950.00
  ('doctoral-completion-suite', 'service_package', 'EUR', 110000),   -- €1,100.00
  ('doctoral-completion-suite', 'service_package', 'GHS', 1850000),  -- GH₵18,500
  ('doctoral-completion-suite', 'service_package', 'ZAR', 2200000),  -- R22,000
  ('doctoral-completion-suite', 'service_package', 'KES', 15500000)  -- KSh 155,000
ON CONFLICT (item_id, currency) DO UPDATE SET amount_minor = EXCLUDED.amount_minor;

