import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { paymentProvider } from "@/lib/payments/paystack";

export async function GET() {
  try {
    const { user } = await requireUser();
    const supabase = createServiceRoleClient();

    // 1. Fetch membership
    const { data: memberships, error: memErr } = await supabase
      .from("memberships")
      .select("id, status, current_period_end, paystack_subscription_code, membership_plans(id, name, description, price_minor, currency, interval, perks)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (memErr) throw memErr;

    const membership = memberships?.[0] || null;

    // 2. Fetch payments history
    const { data: payments, error: payErr } = await supabase
      .from("payments")
      .select("id, amount_minor, currency, status, purpose, paid_at, created_at, provider_reference, invoices(id, number, pdf_url)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (payErr) throw payErr;

    // Generate signed download URLs for invoices
    const formattedPayments = await Promise.all(
      (payments || []).map(async (p: any) => {
        const inv = p.invoices?.[0] || null;
        let invoicePdfUrl = "";
        if (inv?.pdf_url || inv?.number) {
          try {
            const fileName = inv.pdf_url || `${inv.number}.pdf`;
            const { data: signRes } = await supabase.storage
              .from("invoices")
              .createSignedUrl(fileName, 3600);
            invoicePdfUrl = signRes?.signedUrl || "";
          } catch {
            invoicePdfUrl = "";
          }
        }

        return {
          id: p.id,
          amountMinor: p.amount_minor,
          currency: p.currency,
          status: p.status,
          purpose: p.purpose,
          paidAt: p.paid_at || p.created_at,
          reference: p.provider_reference,
          invoiceNumber: inv?.number || null,
          invoiceDownloadUrl: invoicePdfUrl,
        };
      })
    );

    return NextResponse.json({
      membership: membership
        ? {
            id: membership.id,
            status: membership.status,
            currentPeriodEnd: membership.current_period_end,
            subscriptionCode: membership.paystack_subscription_code,
            plan: (membership as any).membership_plans,
          }
        : null,
      payments: formattedPayments,
    });
  } catch (err: any) {
    console.error("[Student Billing GET Error]", err);
    return NextResponse.json({ error: err.message || "Failed to load billing records" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user } = await requireUser();
    const supabase = createServiceRoleClient();

    const body = await req.json();
    const { action, membershipId } = body;

    if (action === "cancel") {
      const { data: membership } = await supabase
        .from("memberships")
        .select("id, status, current_period_end, paystack_subscription_code")
        .eq("id", membershipId)
        .eq("user_id", user.id)
        .single();

      if (!membership) {
        return NextResponse.json({ error: "Membership not found" }, { status: 404 });
      }

      // If subscription code present, disable on provider
      if (membership.paystack_subscription_code) {
        try {
          await paymentProvider.cancelSubscription({
            subscriptionCode: membership.paystack_subscription_code,
          });
        } catch (subErr) {
          console.warn("[Provider Cancel Subscription]", subErr);
        }
      }

      await supabase
        .from("memberships")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", membershipId);

      await supabase.from("audit_log").insert({
        actor_id: user.id,
        action: "membership_cancelled",
        entity: "membership",
        entity_id: membershipId,
        metadata: {
          period_end: membership.current_period_end,
        },
      });

      const endFormatted = new Date(membership.current_period_end).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return NextResponse.json({
        success: true,
        message: `Your membership has been cancelled. You retain full access to your mentoring perks and workspace until the end of your billing cycle on ${endFormatted}.`,
      });
    }

    return NextResponse.json({ error: "Unsupported billing action" }, { status: 400 });
  } catch (err: any) {
    console.error("[Student Billing POST Error]", err);
    return NextResponse.json({ error: err.message || "Failed to process billing request" }, { status: 500 });
  }
}

