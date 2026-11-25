import { NextResponse } from "next/server";
import { checkRateLimit, recordFailedAttempt } from "@/lib/auth/server";
import { paymentProvider } from "@/lib/payments/paystack";
import { processPaymentSuccess, processPaymentFailure } from "@/lib/payments/service";

export async function GET(req: Request) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous";
    const rl = checkRateLimit("payment_verify", ip, 20, 600000);

    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Too many verification requests. Please wait ${rl.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }
    recordFailedAttempt("payment_verify", ip, 20, 600000);

    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference") || searchParams.get("trxref");

    if (!reference || !/^[a-zA-Z0-9_-]{8,100}$/.test(reference)) {
      return NextResponse.json({ error: "A valid transaction reference is required." }, { status: 400 });
    }

    // Server-side verification (Rule 4: Never trust browser redirect as proof of payment)
    const verification = await paymentProvider.verifyPayment(reference);

    if (verification.success) {
      const processResult = await processPaymentSuccess({
        providerReference: reference,
        rawPayload: verification.rawPayload,
      });

      return NextResponse.json({
        success: true,
        reference,
        invoiceNumber: processResult.invoiceNumber,
        pdfUrl: processResult.pdfUrl,
      });
    } else {
      await processPaymentFailure({
        providerReference: reference,
        reason: verification.status,
        rawPayload: verification.rawPayload,
      });

      return NextResponse.json({
        success: false,
        status: verification.status,
        error: "Payment could not be verified or was declined by the issuer.",
      });
    }
  } catch (error: any) {
    console.error("[Payment Verification Error]", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify transaction." },
      { status: 500 }
    );
  }
}

