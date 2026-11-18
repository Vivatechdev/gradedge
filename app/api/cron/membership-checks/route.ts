import { NextRequest } from "next/server";
import { executeCronJob } from "@/lib/cron/logger";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { sendMembershipRenewalNoticeEmail, sendMembershipCancelledEmail } from "@/lib/email";
import { formatPrice } from "@/lib/currency/format";

export async function GET(request: NextRequest) {
  return handleJob(request);
}

export async function POST(request: NextRequest) {
  return handleJob(request);
}

async function handleJob(request: NextRequest) {
  return executeCronJob("membership_checks", request, async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { mocked: true, message: "Database credentials not configured." };
    }

    const supabase = createServiceRoleClient();
    const now = new Date();
    const results = {
      renewalNoticesSent: 0,
      expiredMembershipsHandled: 0,
    };

    // 1. Memberships renewing in 3 days: current_period_end between now and 3 days from now
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();

    const { data: upcomingRenewals } = await supabase
      .from("memberships")
      .select("id, user_id, plan_id, current_period_end, renewal_notice_sent, membership_plans(name, price_ngn), profiles:user_id(email, full_name, preferred_currency)")
      .eq("status", "active")
      .eq("renewal_notice_sent", false)
      .lte("current_period_end", threeDaysFromNow)
      .gte("current_period_end", now.toISOString());

    if (upcomingRenewals && upcomingRenewals.length > 0) {
      for (const m of upcomingRenewals as any[]) {
        const userEmail = m.profiles?.email;
        if (!userEmail) continue;

        const planName = m.membership_plans?.name || "GradEdge Research Membership";
        const currency = m.profiles?.preferred_currency || "USD";
        const amountMinor = m.membership_plans?.price_ngn || 4500000;
        const renewalDateStr = new Date(m.current_period_end).toLocaleDateString("en-US", {
          dateStyle: "medium",
        });

        await sendMembershipRenewalNoticeEmail({
          to: userEmail,
          name: m.profiles?.full_name || "Researcher",
          planName,
          renewalDateStr,
          formattedAmount: formatPrice(amountMinor, currency as any),
          currency,
        });

        await supabase
          .from("memberships")
          .update({ renewal_notice_sent: true, updated_at: new Date().toISOString() })
          .eq("id", m.id);

        results.renewalNoticesSent++;
      }
    }

    // 2. Memberships whose period has ended and status is still active or past_due
    const { data: lapsedMemberships } = await supabase
      .from("memberships")
      .select("id, user_id, current_period_end, membership_plans(name), profiles:user_id(email, full_name)")
      .in("status", ["active", "past_due"])
      .lt("current_period_end", now.toISOString());

    if (lapsedMemberships && lapsedMemberships.length > 0) {
      for (const m of lapsedMemberships as any[]) {
        const userEmail = m.profiles?.email;
        const planName = m.membership_plans?.name || "GradEdge Research Membership";
        const accessEndStr = new Date(m.current_period_end).toLocaleDateString("en-US", {
          dateStyle: "medium",
        });

        await supabase
          .from("memberships")
          .update({
            status: "expired",
            updated_at: new Date().toISOString(),
          })
          .eq("id", m.id);

        if (userEmail) {
          await sendMembershipCancelledEmail({
            to: userEmail,
            name: m.profiles?.full_name || "Researcher",
            planName,
            accessEndStr,
          });
        }

        results.expiredMembershipsHandled++;
      }
    }

    return results;
  });
}

