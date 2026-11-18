import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/server";
import { getAllPricesGrouped, savePriceRecord } from "@/lib/currency/service";
import { SupportedCurrency, isSupportedCurrency } from "@/lib/currency/config";

export async function GET() {
  try {
    await requireRole("admin");
    const items = await getAllPricesGrouped();
    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to load prices" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireRole("admin");
    const body = await req.json();
    const { updates } = body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: "No price updates provided." }, { status: 400 });
    }

    const errors: string[] = [];
    for (const update of updates) {
      const { itemId, itemType, currency, amountMinor } = update;
      if (!itemId || !currency || typeof amountMinor !== "number") {
        errors.push(`Invalid record: ${JSON.stringify(update)}`);
        continue;
      }
      if (!isSupportedCurrency(currency)) {
        errors.push(`Unsupported currency: ${currency}`);
        continue;
      }

      const res = await savePriceRecord(
        itemId,
        itemType || "service_package",
        currency as SupportedCurrency,
        Math.round(amountMinor)
      );
      if (!res.success) {
        errors.push(`Failed to save ${itemId} (${currency}): ${res.error}`);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: updates.length });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to save prices" },
      { status: 500 }
    );
  }
}

