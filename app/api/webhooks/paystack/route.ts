import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function POST(req: Request) {
  try {
    const secret = process.env.PAYSTACK_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Webhook secret is not configured" },
        { status: 500 }
      );
    }

    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // Placeholder: Process Paystack event using service role client
    // e.g. event.event === 'charge.success'
    const supabase = createServiceRoleClient();
    await supabase.from("audit_log").insert({
      action: "webhook_received",
      entity: "payment",
      metadata: { event_type: event.event, reference: event.data?.reference },
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Paystack Webhook Error]", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
