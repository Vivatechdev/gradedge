import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { sendEmail, renderBrandedLayout } from "@/lib/email";

export interface CreateNotificationParams {
  userId: string;
  type:
    | "session_booked"
    | "session_reminder"
    | "session_cancelled"
    | "payment_received"
    | "payment_failed"
    | "project_status"
    | "mentor_message"
    | "mentor_assigned"
    | "accelerator_update"
    | "general";
  title: string;
  body: string;
  link?: string | null;
  sendEmailNotification?: boolean;
  emailSubject?: string;
}

export interface NotificationRecord {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

/**
 * Creates an in-app notification row and optionally dispatches a branded email.
 */
export async function createNotification(params: CreateNotificationParams): Promise<NotificationRecord | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log(`[MOCK Notification] User: ${params.userId} | Type: ${params.type} | Title: ${params.title}`);
    return {
      id: "mock-notif-" + Date.now(),
      user_id: params.userId,
      type: params.type,
      title: params.title,
      body: params.body,
      link: params.link || null,
      read_at: null,
      created_at: new Date().toISOString(),
    };
  }

  const supabase = createServiceRoleClient();

  // 1. Insert into notifications table
  const { data: notif, error } = await supabase
    .from("notifications")
    .insert({
      user_id: params.userId,
      type: params.type,
      title: params.title,
      body: params.body,
      link: params.link || null,
      read_at: null,
    })
    .select()
    .single();

  if (error) {
    console.error("[Notification Service Error]", error);
    return null;
  }

  // 2. Dispatch email if requested
  if (params.sendEmailNotification) {
    try {
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("id", params.userId)
        .single();

      if (userProfile?.email) {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gradedge.com";
        const emailLink = params.link
          ? params.link.startsWith("http")
            ? params.link
            : `${siteUrl}${params.link}`
          : `${siteUrl}/student/notifications`;

        const bodyHtml = `
          <p>Dear ${escapeHtml(userProfile.full_name?.split(" ")[0] || "Researcher")},</p>
          <div style="background-color: #FAF8F4; border-left: 3px solid #14263F; padding: 14px 18px; margin: 16px 0; font-size: 14px; color: #2B2B2B;">
            <p style="margin: 0 0 6px 0; font-weight: 600; color: #14263F;">${escapeHtml(params.title)}</p>
            <p style="margin: 0; line-height: 1.6;">${escapeHtml(params.body)}</p>
          </div>
          <p style="margin: 24px 0;">
            <a href="${emailLink}" style="background-color: #14263F; color: #FFFFFF; text-decoration: none; padding: 11px 22px; font-weight: 500; font-size: 13px; border-radius: 2px; display: inline-block;">
              View in Research Portal &rarr;
            </a>
          </p>
        `;

        const { html, text } = renderBrandedLayout({
          title: params.emailSubject || params.title,
          bodyHtml,
          reason: "You have an active research account with GradEdge.",
        });

        await sendEmail({
          to: userProfile.email,
          subject: params.emailSubject || `[GradEdge Notice] ${params.title}`,
          html,
          text,
        });
      }
    } catch (emailErr) {
      console.error("[Notification Email Dispatch Error]", emailErr);
    }
  }

  return notif;
}

/**
 * Get count of unread notifications for a user.
 */
export async function getUnreadCount(userId: string): Promise<number> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return 0;
  }

  try {
    const supabase = createServiceRoleClient();
    const { count, error } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .is("read_at", null);

    if (error) throw error;
    return count || 0;
  } catch (err) {
    console.error("[Get Unread Count Error]", err);
    return 0;
  }
}

/**
 * Mark a single notification as read.
 */
export async function markAsRead(notificationId: string, userId: string): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return true;
  }

  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", notificationId)
      .eq("user_id", userId);

    return !error;
  } catch {
    return false;
  }
}

/**
 * Mark all unread notifications as read for a user.
 */
export async function markAllAsRead(userId: string): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return true;
  }

  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("read_at", null);

    return !error;
  } catch {
    return false;
  }
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "and")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

