import { NextRequest } from "next/server";
import { executeCronJob } from "@/lib/cron/logger";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { sendEmail, renderBrandedLayout } from "@/lib/email";

export async function GET(request: NextRequest) {
  return handleJob(request);
}

export async function POST(request: NextRequest) {
  return handleJob(request);
}

async function handleJob(request: NextRequest) {
  return executeCronJob("daily_admin_digest", request, async () => {
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admin@gradedge.com";
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log(`[MOCK Cron] Daily Admin Digest would be sent to ${adminEmail}`);
      return {
        mocked: true,
        sentTo: adminEmail,
        period: "24h",
      };
    }

    const supabase = createServiceRoleClient();

    // 1. Fetch count of new leads / consultations in last 24h
    const { count: newBookingsCount } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .gte("created_at", yesterday);

    // 2. Fetch new support requests / leads
    const { count: newLeadsCount } = await supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .gte("created_at", yesterday);

    // 3. Fetch successful payments
    const { data: recentPayments } = await supabase
      .from("payments")
      .select("amount_minor, currency, status")
      .eq("status", "success")
      .gte("created_at", yesterday);

    const totalTransactions = recentPayments?.length || 0;

    // 4. Fetch unresolved integrity flags
    const { data: openFlags } = await supabase
      .from("integrity_flags")
      .select("id, reason, severity, created_at")
      .is("resolved_at", null);

    const openFlagsCount = openFlags?.length || 0;

    // 5. Unassigned message threads
    const { count: unassignedThreadsCount } = await supabase
      .from("message_threads")
      .select("id", { count: "exact", head: true })
      .is("mentor_id", null);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gradedge.com";
    const dateFormatted = now.toLocaleDateString("en-US", { dateStyle: "full" });

    const bodyHtml = `
      <p>Here is the 24-hour academic operations summary for <strong>${dateFormatted}</strong>:</p>
      
      <div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; padding: 18px 22px; margin: 20px 0; border-radius: 2px;">
        <table style="width: 100%; font-size: 14px; line-height: 2;">
          <tr>
            <td style="color: #555555; width: 60%;"><strong>New Scoping Consultations Booked:</strong></td>
            <td style="color: #14263F; font-weight: bold;">${newBookingsCount || 0}</td>
          </tr>
          <tr>
            <td style="color: #555555;"><strong>New Inquiries / Support Requests:</strong></td>
            <td style="color: #14263F; font-weight: bold;">${newLeadsCount || 0}</td>
          </tr>
          <tr>
            <td style="color: #555555;"><strong>Settled Transactions:</strong></td>
            <td style="color: #14263F; font-weight: bold;">${totalTransactions} payment(s)</td>
          </tr>
          <tr>
            <td style="color: #555555;"><strong>Unresolved Academic Integrity Flags:</strong></td>
            <td style="color: ${openFlagsCount > 0 ? "#C0392B" : "#2E7D5B"}; font-weight: bold;">
              ${openFlagsCount} flag(s)
            </td>
          </tr>
          <tr>
            <td style="color: #555555;"><strong>Unassigned Mentoring Threads:</strong></td>
            <td style="color: #14263F; font-weight: bold;">${unassignedThreadsCount || 0}</td>
          </tr>
        </table>
      </div>

      <p style="margin: 28px 0;">
        <a href="${siteUrl}/admin" style="background-color: #14263F; color: #FFFFFF; text-decoration: none; padding: 12px 24px; font-weight: 500; font-size: 14px; border-radius: 2px; display: inline-block;">
          Open Admin Operations Center &rarr;
        </a>
      </p>
    `;

    const { html, text } = renderBrandedLayout({
      title: `Daily Operations Digest — ${dateFormatted}`,
      bodyHtml,
      reason: "Daily scheduled administrative digest for GradEdge platform operators.",
    });

    await sendEmail({
      to: adminEmail,
      subject: `[GradEdge Daily Digest] ${dateFormatted} Summary`,
      html,
      text,
    });

    return {
      sentTo: adminEmail,
      newBookingsCount,
      newLeadsCount,
      totalTransactions,
      openFlagsCount,
      unassignedThreadsCount,
      executedAt: now.toISOString(),
    };
  });
}

