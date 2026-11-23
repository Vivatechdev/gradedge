import { NextRequest, NextResponse } from "next/server";
import { getPriceForItem, getAllPricesGrouped } from "@/lib/currency/service";
import { isSupportedCurrency, SupportedCurrency, DEFAULT_CURRENCY } from "@/lib/currency/config";
import { formatPrice } from "@/lib/currency/format";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const currencyParam = searchParams.get("currency") || DEFAULT_CURRENCY;
    const itemIdParam = searchParams.get("itemId");

    const currency: SupportedCurrency = isSupportedCurrency(currencyParam)
      ? (currencyParam as SupportedCurrency)
      : DEFAULT_CURRENCY;

    // Single item query
    if (itemIdParam) {
      const priceRes = await getPriceForItem(itemIdParam, currency);
      return NextResponse.json({
        itemId: itemIdParam,
        currency: priceRes.currency,
        amountMinor: priceRes.amountMinor,
        formatted: formatPrice(priceRes.amountMinor, priceRes.currency),
        paystackDirectSupported: priceRes.paystackDirectSupported,
      });
    }

    // All items for the requested currency
    const grouped = await getAllPricesGrouped();
    const pricesByItem: Record<string, { amountMinor: number; formatted: string }> = {};

    for (const item of grouped) {
      const amountMinor = item.prices[currency] ?? item.prices[DEFAULT_CURRENCY];
      pricesByItem[item.itemId] = {
        amountMinor,
        formatted: formatPrice(amountMinor, currency),
      };
    }

    return NextResponse.json({
      currency,
      prices: pricesByItem,
    });
  } catch (err: any) {
    console.error("[Prices API Error]", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
