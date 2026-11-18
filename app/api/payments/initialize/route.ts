import { NextResponse } from "next/server";
import crypto from "crypto";
import { checkRateLimit, recordFailedAttempt } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { paymentProvider } from "@/lib/payments/paystack";
import { lookupPrice, createPaymentRecord } from "@/lib/payments/service";
import { Currency, PaymentPurpose } from "@/lib/payments/types";

export async function POST(req: Request) {
  try {
    // 1. IP rate limiting (10 attempts per 10 minutes)
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous";
    const rl = checkRateLimit("payment_init", ip, 10, 600000);

    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Too many payment initialization attempts. Please wait ${rl.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }
    recordFailedAttempt("payment_init", ip, 10, 600000);

    const body = await req.json();
    const {
      purpose,
      currency = "USD",
      customerEmail,
      customerName,
      packageId,
      serviceSlug,
      planId,
      bookingId,
      applicationId,
      isInstallment,
      installmentNumber,
      installmentTotal,
    } = body;

    if (!purpose || !["booking", "package", "program", "membership"].includes(purpose)) {
      return NextResponse.json({ error: "A valid payment purpose is required." }, { status: 400 });
    }

    const normCurrency = (currency || "USD").toUpperCase() as Currency;
    if (!["USD", "NGN", "GBP", "EUR", "GHS", "ZAR", "KES"].includes(normCurrency)) {
      return NextResponse.json(
        { error: `Currency ${currency} is not supported. Supported currencies: USD, NGN, GBP, EUR, GHS, ZAR, KES.` },
        { status: 400 }
      );
    }

    // 2. Identify logged-in user if present
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const email = (customerEmail || user?.email || "").trim().toLowerCase();
    const name = (customerName || user?.user_metadata?.full_name || "Academic Candidate").trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid customer email is required." }, { status: 400 });
    }

    // 3. Server-side price lookup (Rule 9: never accept price from client)
    const priceInfo = await lookupPrice({
      purpose: purpose as PaymentPurpose,
      currency: currency as Currency,
      packageId,
      serviceSlug,
      planId,
      isInstallment: Boolean(isInstallment),
      installmentNumber: Number(installmentNumber) || 1,
      installmentTotal: Number(installmentTotal) || 3,
    });

    // 4. Generate unique, tamper-proof provider reference
    const reference = `GE_PAY_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const callbackUrl = `${siteUrl}/checkout/verify?reference=${reference}`;

    const relatedId =
      purpose === "booking"
        ? bookingId
        : purpose === "program"
        ? applicationId
        : null;

    const chargeCurrency = priceInfo.chargeCurrency || priceInfo.currency;
    const chargeAmountMinor = priceInfo.chargeAmountMinor || priceInfo.amountMinor;

    // 5. Store initiated payment record
    await createPaymentRecord({
      userId: user?.id || null,
      customerEmail: email,
      customerName: name,
      purpose: purpose as PaymentPurpose,
      currency: chargeCurrency,
      amountMinor: chargeAmountMinor,
      reference,
      relatedId,
      metadata: {
        ...priceInfo.metadata,
        title: priceInfo.title,
        description: priceInfo.description,
        items: priceInfo.items,
        service_slug: serviceSlug,
        package_id: packageId,
        plan_id: planId,
        booking_id: bookingId,
        application_id: applicationId,
        display_currency: priceInfo.currency,
        display_amount_minor: priceInfo.amountMinor,
        is_approximate: Boolean(priceInfo.isApproximate),
      },
    });

    // 6. Initialize transaction with Paystack provider
    const initResult = await paymentProvider.initializePayment({
      email,
      amountMinor: chargeAmountMinor,
      currency: chargeCurrency,
      reference,
      callbackUrl,
      metadata: {
        custom_fields: [
          { display_name: "Purpose", variable_name: "purpose", value: priceInfo.title },
          { display_name: "Student Name", variable_name: "student_name", value: name },
          { display_name: "Display Amount", variable_name: "display_amount", value: `${priceInfo.currency} ${priceInfo.amountMinor / 100}` },
        ],
      },
    });

    return NextResponse.json({
      authorizationUrl: initResult.authorizationUrl,
      reference: initResult.reference,
      amountMinor: priceInfo.amountMinor,
      currency: priceInfo.currency,
    });
  } catch (error: any) {
    console.error("[Payment Init Error]", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize secure payment checkout." },
      { status: 500 }
    );
  }
}
