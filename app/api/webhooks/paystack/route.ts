import { NextResponse } from "next/server";
import { paymentProvider } from "@/lib/payments/paystack";
import { processPaymentSuccess, processPaymentFailure } from "@/lib/payments/service";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing x-paystack-signature header." }, { status: 400 });
    }

    // 1. Verify HMAC SHA512 signature using paymentProvider
    const { isValid, event: parsedEvent } = await paymentProvider.handleWebhook(rawBody, signature);

    if (!isValid || !parsedEvent) {
      return NextResponse.json({ error: "Invalid signature verification." }, { status: 400 });
    }

    const { event, data } = parsedEvent;
    const supabase = createServiceRoleClient();

    // 2. Log webhook reception in audit log
    await supabase.from("audit_log").insert({
      action: "webhook_received",
      entity: "payment",
      metadata: {
        event_type: event,
        reference: (data as any)?.reference,
        subscription_code: (data as any)?.subscription_code,
      },
    });

    // 3. Process events
    switch (event) {
      case "charge.success": {
        const reference = (data as any)?.reference;
        if (reference) {
          await processPaymentSuccess({
            providerReference: reference,
            rawPayload: data,
          });
        }
        break;
      }

      case "charge.failed": {
        const reference = (data as any)?.reference;
        if (reference) {
          await processPaymentFailure({
            providerReference: reference,
            reason: (data as any)?.gateway_response || "Payment declined",
            rawPayload: data,
          });
        }
        break;
      }

      case "subscription.create": {
        const subCode = (data as any)?.subscription_code;
        const customerEmail = (data as any)?.customer?.email;
        if (subCode && customerEmail) {
          const { data: userProfile } = await supabase
            .from("profiles")
            .select("id")
            .eq("email", customerEmail)
            .single();

          if (userProfile) {
            const periodEnd = new Date();
            periodEnd.setDate(periodEnd.getDate() + 30);

            await supabase.from("memberships").upsert({
              user_id: userProfile.id,
              plan_id: "00000000-0000-0000-0001-000000000001",
              status: "active",
              current_period_end: periodEnd.toISOString(),
              paystack_subscription_code: subCode,
              updated_at: new Date().toISOString(),
            });
          }
        }
        break;
      }

      case "subscription.disable": {
        const subCode = (data as any)?.subscription_code;
        if (subCode) {
          await supabase
            .from("memberships")
            .update({
              status: "cancelled",
              updated_at: new Date().toISOString(),
            })
            .eq("paystack_subscription_code", subCode);
        }
        break;
      }

      case "invoice.payment_failed": {
        const subCode = (data as any)?.subscription_code;
        if (subCode) {
          await supabase
            .from("memberships")
            .update({
              status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("paystack_subscription_code", subCode);
        }
        break;
      }

      case "refund.processed": {
        const txRef = (data as any)?.transaction_reference || (data as any)?.reference;
        if (txRef) {
          await supabase
            .from("payments")
            .update({
              status: "refunded",
              updated_at: new Date().toISOString(),
            })
            .eq("provider_reference", txRef);
        }
        break;
      }

      default: {
        // Unhandled event logged quietly
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("[Paystack Webhook Handler Error]", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}
