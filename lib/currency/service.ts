import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  SupportedCurrency,
  DEFAULT_CURRENCY,
  isSupportedCurrency,
  CURRENCY_METADATA,
} from "./config";

export interface ItemPriceRecord {
  itemId: string;
  itemType: "service_package" | "membership_plan" | "session" | "accelerator";
  currency: SupportedCurrency;
  amountMinor: number;
  isFallbackUsd?: boolean;
}

/**
 * In-memory runtime cache for admin price overrides.
 * Ensures that any price saved in the admin dashboard takes effect immediately
 * across all public pages, checkout, and Paystack transactions in real time.
 */
const RUNTIME_PRICE_OVERRIDES: Record<string, Record<string, number>> = {};

/**
 * Built-in Canonical Fallback Prices
 * Accurately consolidated with student consultation rates, packages, and accelerator.
 * 100 minor units = 1 major unit (cents, kobo, pesewas, etc.)
 */
export const DEFAULT_CANONICAL_PRICES: Record<string, Record<SupportedCurrency, number>> = {
  // Baseline 60m session
  "session-60": {
    USD: 12000,       // $120.00
    NGN: 18000000,   // ₦180,000
    GBP: 9500,        // £95.00
    EUR: 11000,       // €110.00
    GHS: 186000,      // GH₵1,860
    ZAR: 222000,      // R2,220
    KES: 1560000,     // KSh 15,600
  },
  // 1-on-1 Research and Methodology Tutoring
  "serv-tutoring": {
    USD: 12000,       // $120.00
    NGN: 18000000,   // ₦180,000
    GBP: 9500,        // £95.00
    EUR: 11000,       // €110.00
    GHS: 186000,      // GH₵1,860
    ZAR: 222000,      // R2,220
    KES: 1560000,     // KSh 15,600
  },
  // Quantitative and Statistical Modeling Review
  "serv-data": {
    USD: 16000,       // $160.00
    NGN: 24000000,   // ₦240,000
    GBP: 12600,       // £126.00
    EUR: 14700,       // €147.00
    GHS: 248000,      // GH₵2,480
    ZAR: 296000,      // R2,960
    KES: 2080000,     // KSh 20,800
  },
  // Developmental Editing and Chapter Critique
  "serv-editing": {
    USD: 14000,       // $140.00
    NGN: 21000000,   // ₦210,000
    GBP: 11000,       // £110.00
    EUR: 12900,       // €129.00
    GHS: 217000,      // GH₵2,170
    ZAR: 259000,      // R2,590
    KES: 1820000,     // KSh 18,200
  },
  // Mock Defense Presentation and Defense Coaching
  "serv-defense": {
    USD: 18000,       // $180.00
    NGN: 27000000,   // ₦270,000
    GBP: 14200,       // £142.00
    EUR: 16500,       // €165.00
    GHS: 279000,      // GH₵2,790
    ZAR: 333000,      // R3,330
    KES: 2340000,     // KSh 23,400
  },
  // 12-Week Doctoral Accelerator
  "accelerator-full": {
    USD: 120000,      // $1,200.00
    NGN: 180000000,  // ₦1,800,000
    GBP: 95000,       // £950.00
    EUR: 110000,      // €1,100.00
    GHS: 1860000,     // GH₵18,600
    ZAR: 2220000,     // R22,200
    KES: 15600000,    // KSh 156,000
  },
  // Accelerator Installment (Part 1 of 3)
  "accelerator-installment": {
    USD: 40000,       // $400.00
    NGN: 60000000,   // ₦600,000
    GBP: 32000,       // £320.00
    EUR: 37000,       // €370.00
    GHS: 620000,      // GH₵6,200
    ZAR: 740000,      // R7,400
    KES: 5200000,     // KSh 52,000
  },
  scholar: {
    USD: 9500,        // $95.00
    NGN: 14250000,   // ₦142,500
    GBP: 7500,        // £75.00
    EUR: 8800,        // €88.00
    GHS: 147000,      // GH₵1,470
    ZAR: 175000,      // R1,750
    KES: 1235000,     // KSh 12,350
  },
  fellow: {
    USD: 18000,       // $180.00
    NGN: 27000000,   // ₦270,000
    GBP: 14200,       // £142.00
    EUR: 16500,       // €165.00
    GHS: 279000,      // GH₵2,790
    ZAR: 333000,      // R3,330
    KES: 2340000,     // KSh 23,400
  },
  "proposal-architecture": {
    USD: 45000,       // $450.00
    NGN: 67500000,   // ₦675,000
    GBP: 36000,       // £360.00
    EUR: 42000,       // €420.00
    GHS: 700000,      // GH₵7,000
    ZAR: 820000,      // R8,200
    KES: 5800000,     // KSh 58,000
  },
  "doctoral-completion-suite": {
    USD: 120000,      // $1,200.00
    NGN: 180000000,  // ₦1,800,000
    GBP: 95000,       // £950.00
    EUR: 110000,      // €1,100.00
    GHS: 1860000,     // GH₵18,600
    ZAR: 2220000,     // R22,200
    KES: 15600000,    // KSh 156,000
  },
};

/**
 * Resolves an item price with real-time conversion and database/admin precedence.
 */
export async function getPriceForItem(
  itemId: string,
  targetCurrency: SupportedCurrency
): Promise<{
  amountMinor: number;
  currency: SupportedCurrency;
  isFallbackUsd: boolean;
  paystackDirectSupported: boolean;
}> {
  const normCurrency = isSupportedCurrency(targetCurrency) ? targetCurrency : DEFAULT_CURRENCY;
  const paystackDirectSupported = CURRENCY_METADATA[normCurrency]?.paystackDirectSupported ?? false;

  // 1. Check in-memory runtime overrides (populated when admin saves prices)
  if (RUNTIME_PRICE_OVERRIDES[itemId]?.[normCurrency] !== undefined) {
    return {
      amountMinor: RUNTIME_PRICE_OVERRIDES[itemId][normCurrency],
      currency: normCurrency,
      isFallbackUsd: false,
      paystackDirectSupported,
    };
  }

  // 2. Query Database table 'prices'
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createServiceRoleClient();
      
      const { data: exactPrice } = await supabase
        .from("prices")
        .select("amount_minor, currency")
        .eq("item_id", itemId)
        .eq("currency", normCurrency)
        .maybeSingle();

      if (exactPrice && exactPrice.amount_minor !== null) {
        return {
          amountMinor: Number(exactPrice.amount_minor),
          currency: normCurrency,
          isFallbackUsd: false,
          paystackDirectSupported,
        };
      }

      // If no explicit local price in DB, check base USD price in DB and convert in real time
      if (normCurrency !== DEFAULT_CURRENCY) {
        const { data: usdPrice } = await supabase
          .from("prices")
          .select("amount_minor, currency")
          .eq("item_id", itemId)
          .eq("currency", DEFAULT_CURRENCY)
          .maybeSingle();

        if (usdPrice && usdPrice.amount_minor !== null) {
          const usdMinor = Number(usdPrice.amount_minor);
          const meta = CURRENCY_METADATA[normCurrency] || CURRENCY_METADATA.USD;
          const rate = meta.approximateExchangeFromUsd;
          const convertedMinor = Math.round((usdMinor / 100) * rate * 100);

          return {
            amountMinor: convertedMinor,
            currency: normCurrency,
            isFallbackUsd: false,
            paystackDirectSupported,
          };
        }
      }
    }
  } catch (error) {
    console.warn(`[PriceService] DB price lookup failed for '${itemId}' (${normCurrency}), using canonical:`, error);
  }

  // 3. Fallback to canonical dictionary
  const fallbackDict = DEFAULT_CANONICAL_PRICES[itemId] || DEFAULT_CANONICAL_PRICES["session-60"];
  if (fallbackDict) {
    if (fallbackDict[normCurrency] !== undefined) {
      return {
        amountMinor: fallbackDict[normCurrency],
        currency: normCurrency,
        isFallbackUsd: false,
        paystackDirectSupported,
      };
    }

    // Real-time conversion from base USD price in canonical dictionary
    const baseUsdMinor = fallbackDict[DEFAULT_CURRENCY] || 12000;
    const meta = CURRENCY_METADATA[normCurrency] || CURRENCY_METADATA.USD;
    const rate = meta.approximateExchangeFromUsd;
    const convertedMinor = Math.round((baseUsdMinor / 100) * rate * 100);

    return {
      amountMinor: convertedMinor,
      currency: normCurrency,
      isFallbackUsd: false,
      paystackDirectSupported,
    };
  }

  return {
    amountMinor: 12000, // $120.00 baseline
    currency: DEFAULT_CURRENCY,
    isFallbackUsd: true,
    paystackDirectSupported: true,
  };
}

/**
 * Fetch all prices grouped by item (for Admin Prices Screen)
 */
export async function getAllPricesGrouped(): Promise<
  Array<{
    itemId: string;
    itemType: string;
    label: string;
    prices: Record<SupportedCurrency, number>;
  }>
> {
  const itemCatalog: Record<string, { label: string; itemType: string }> = {
    "session-60": { label: "Academic Mentoring Session — Baseline (60m)", itemType: "session" },
    "serv-tutoring": { label: "1-on-1 Research and Methodology Tutoring (60m)", itemType: "session" },
    "serv-data": { label: "Quantitative and Statistical Modeling Review (60m)", itemType: "session" },
    "serv-editing": { label: "Developmental Editing and Chapter Critique (60m)", itemType: "session" },
    "serv-defense": { label: "Mock Defense Coaching and Presentation (60m)", itemType: "session" },
    "accelerator-full": { label: "12-Week Doctoral Accelerator (Full Tuition)", itemType: "accelerator" },
    "accelerator-installment": { label: "12-Week Doctoral Accelerator (1 of 3 Installments)", itemType: "accelerator" },
    scholar: { label: "Monthly Membership — Scholar Tier", itemType: "membership_plan" },
    fellow: { label: "Monthly Membership — Fellow Tier", itemType: "membership_plan" },
    "proposal-architecture": { label: "Package — Proposal Framing Suite", itemType: "service_package" },
    "doctoral-completion-suite": { label: "Package — Doctoral Completion Suite", itemType: "service_package" },
  };

  const results: Record<string, Record<SupportedCurrency, number>> = {};
  for (const itemId of Object.keys(itemCatalog)) {
    results[itemId] = { ...(DEFAULT_CANONICAL_PRICES[itemId] || DEFAULT_CANONICAL_PRICES["session-60"]) };
    // Layer in any runtime overrides
    if (RUNTIME_PRICE_OVERRIDES[itemId]) {
      Object.assign(results[itemId], RUNTIME_PRICE_OVERRIDES[itemId]);
    }
  }

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createServiceRoleClient();
      const { data: dbPrices } = await supabase
        .from("prices")
        .select("item_id, item_type, currency, amount_minor");

      if (dbPrices && dbPrices.length > 0) {
        for (const row of dbPrices) {
          if (!results[row.item_id]) {
            results[row.item_id] = { ...DEFAULT_CANONICAL_PRICES["session-60"] };
          }
          const curr = row.currency as SupportedCurrency;
          if (isSupportedCurrency(curr)) {
            results[row.item_id][curr] = Number(row.amount_minor);
          }
        }
      }
    }
  } catch (err) {
    console.warn("[PriceService] Failed to load DB prices for admin:", err);
  }

  return Object.entries(itemCatalog).map(([itemId, meta]) => ({
    itemId,
    itemType: meta.itemType,
    label: meta.label,
    prices: results[itemId] || DEFAULT_CANONICAL_PRICES[itemId] || DEFAULT_CANONICAL_PRICES["session-60"],
  }));
}

/**
 * Update or insert a price record (Used by Admin Prices Screen)
 */
export async function savePriceRecord(
  itemId: string,
  itemType: string,
  currency: SupportedCurrency,
  amountMinor: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Immediately store in runtime cache so live traffic picks it up without lag
    if (!RUNTIME_PRICE_OVERRIDES[itemId]) {
      RUNTIME_PRICE_OVERRIDES[itemId] = {};
    }
    RUNTIME_PRICE_OVERRIDES[itemId][currency] = amountMinor;

    // 2. Persist to Supabase if connected
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createServiceRoleClient();
      const { error } = await supabase.from("prices").upsert(
        {
          item_id: itemId,
          item_type: itemType,
          currency,
          amount_minor: amountMinor,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "item_id,currency" }
      );

      if (error) throw error;
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

