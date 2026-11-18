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
 * Built-in Canonical Fallback Prices
 * Rule 2: If a currency has no price, fall back to USD.
 * Provides resilient, offline-safe values matching seed migration.
 */
export const DEFAULT_CANONICAL_PRICES: Record<string, Record<SupportedCurrency, number>> = {
  "session-60": {
    USD: 7500,
    NGN: 3500000,
    GBP: 6000,
    EUR: 7000,
    GHS: 110000,
    ZAR: 135000,
    KES: 950000,
  },
  "accelerator-full": {
    USD: 120000,
    NGN: 120000000,
    GBP: 95000,
    EUR: 110000,
    GHS: 1800000,
    ZAR: 2200000,
    KES: 15500000,
  },
  "accelerator-installment": {
    USD: 40000,
    NGN: 40000000,
    GBP: 32000,
    EUR: 37000,
    GHS: 600000,
    ZAR: 740000,
    KES: 5200000,
  },
  scholar: {
    USD: 9500,
    NGN: 4500000,
    GBP: 7500,
    EUR: 8800,
    GHS: 145000,
    ZAR: 175000,
    KES: 1250000,
  },
  fellow: {
    USD: 18000,
    NGN: 8500000,
    GBP: 14000,
    EUR: 16500,
    GHS: 275000,
    ZAR: 330000,
    KES: 2350000,
  },
  "proposal-architecture": {
    USD: 45000,
    NGN: 25000000,
    GBP: 36000,
    EUR: 42000,
    GHS: 700000,
    ZAR: 820000,
    KES: 5800000,
  },
  "doctoral-completion-suite": {
    USD: 120000,
    NGN: 75000000,
    GBP: 95000,
    EUR: 110000,
    GHS: 1850000,
    ZAR: 2200000,
    KES: 15500000,
  },
};

/**
 * Resolves an item price from the database with USD fallback
 * Rule 2: "store an explicit price per currency... If a currency has no price, fall back to USD."
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

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createServiceRoleClient();
      
      // 1. Attempt exact match query
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

      // 2. If target currency price is not found, fallback to USD from database
      if (normCurrency !== DEFAULT_CURRENCY) {
        const { data: usdPrice } = await supabase
          .from("prices")
          .select("amount_minor, currency")
          .eq("item_id", itemId)
          .eq("currency", DEFAULT_CURRENCY)
          .maybeSingle();

        if (usdPrice && usdPrice.amount_minor !== null) {
          return {
            amountMinor: Number(usdPrice.amount_minor),
            currency: DEFAULT_CURRENCY,
            isFallbackUsd: true,
            paystackDirectSupported: true,
          };
        }
      }
    }
  } catch (error) {
    console.warn(`[PriceService] DB price lookup failed for '${itemId}' (${normCurrency}), using fallback:`, error);
  }

  // 3. Fallback to in-memory dictionary
  const fallbackDict = DEFAULT_CANONICAL_PRICES[itemId];
  if (fallbackDict) {
    if (fallbackDict[normCurrency] !== undefined) {
      return {
        amountMinor: fallbackDict[normCurrency],
        currency: normCurrency,
        isFallbackUsd: false,
        paystackDirectSupported,
      };
    }
    if (fallbackDict[DEFAULT_CURRENCY] !== undefined) {
      return {
        amountMinor: fallbackDict[DEFAULT_CURRENCY],
        currency: DEFAULT_CURRENCY,
        isFallbackUsd: true,
        paystackDirectSupported: true,
      };
    }
  }

  // 4. Default safe fallback
  return {
    amountMinor: 7500, // $75.00 default
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
    "session-60": { label: "Academic Mentoring Session (60m)", itemType: "session" },
    "accelerator-full": { label: "12-Week Doctoral Accelerator (Full Tuition)", itemType: "accelerator" },
    "accelerator-installment": { label: "12-Week Doctoral Accelerator (1 of 3 Installments)", itemType: "accelerator" },
    scholar: { label: "Monthly Membership — Scholar Tier", itemType: "membership_plan" },
    fellow: { label: "Monthly Membership — Fellow Tier", itemType: "membership_plan" },
    "proposal-architecture": { label: "Package — Proposal Framing Suite", itemType: "service_package" },
    "doctoral-completion-suite": { label: "Package — Doctoral Completion Suite", itemType: "service_package" },
  };

  const results: Record<string, Record<SupportedCurrency, number>> = {};
  for (const itemId of Object.keys(itemCatalog)) {
    results[itemId] = { ...DEFAULT_CANONICAL_PRICES[itemId] };
  }

  try {
    const supabase = createServiceRoleClient();
    const { data: dbPrices } = await supabase
      .from("prices")
      .select("item_id, item_type, currency, amount_minor");

    if (dbPrices && dbPrices.length > 0) {
      for (const row of dbPrices) {
        if (!results[row.item_id]) {
          results[row.item_id] = { ...DEFAULT_CANONICAL_PRICES["session-60"] };
        }
        if (isSupportedCurrency(row.currency)) {
          results[row.item_id][row.currency] = Number(row.amount_minor);
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
    prices: results[itemId] || DEFAULT_CANONICAL_PRICES[itemId],
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
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

