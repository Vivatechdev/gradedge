import { createServiceRoleClient } from "@/lib/supabase/service-role";

export interface TemplateConfig {
  subject: string;
  intro?: string;
}

export type EmailTemplateKey =
  | "welcome"
  | "email_verification"
  | "password_reset"
  | "consultation_confirmed"
  | "session_reminder_24h"
  | "session_reminder_1h"
  | "booking_cancelled_or_rescheduled"
  | "payment_receipt"
  | "payment_failed"
  | "accelerator_application_received"
  | "accelerator_accepted"
  | "accelerator_waitlisted"
  | "accelerator_declined"
  | "new_message_digest"
  | "project_status_changed"
  | "membership_renewal_notice"
  | "membership_cancelled"
  | "newsletter_double_opt_in"
  | "workshop_request_received"
  | "resource_download_delivery"
  | "mentor_assigned";

export const DEFAULT_EMAIL_TEMPLATES: Record<EmailTemplateKey, TemplateConfig> = {
  welcome: {
    subject: "Welcome to GradEdge Academic Solutions",
    intro: "Welcome to GradEdge. We are honored to accompany your postgraduate inquiry with methodological rigor and scholarly care.",
  },
  email_verification: {
    subject: "Verify Your Email Address — GradEdge Academic Solutions",
    intro: "Please verify your email address to secure your student portal and research repository access.",
  },
  password_reset: {
    subject: "Reset Your GradEdge Password",
    intro: "A password reset request was initiated for your GradEdge student account.",
  },
  consultation_confirmed: {
    subject: "Consultation Confirmed: Academic Scoping Session",
    intro: "Your complimentary 20-minute advisory consultation has been scheduled. A calendar file (.ics) is attached.",
  },
  session_reminder_24h: {
    subject: "Upcoming Advisory Session Tomorrow",
    intro: "This is a quiet reminder that your scheduled research consultation begins in 24 hours.",
  },
  session_reminder_1h: {
    subject: "Your Advisory Session Begins in 1 Hour",
    intro: "Your research consultation begins in one hour. Please have your current draft or methodology notes accessible.",
  },
  booking_cancelled_or_rescheduled: {
    subject: "Advisory Session Schedule Update",
    intro: "Your research consultation booking status has been updated.",
  },
  payment_receipt: {
    subject: "Payment Receipt and Invoice — GradEdge Academic Solutions",
    intro: "Thank you for your payment. Your official PDF receipt and invoice details are summarized below.",
  },
  payment_failed: {
    subject: "Payment Unsuccessful — Action Required",
    intro: "We encountered an issue processing your transaction. Your project and booking holds are preserved temporarily.",
  },
  accelerator_application_received: {
    subject: "Graduate Accelerator Application Received",
    intro: "Thank you for applying to the Graduate Accelerator. The admissions committee has received your dossier.",
  },
  accelerator_accepted: {
    subject: "Graduate Accelerator: Acceptance and Enrollment Offer",
    intro: "We are pleased to inform you that your research proposal has been approved for the upcoming Accelerator cohort.",
  },
  accelerator_waitlisted: {
    subject: "Graduate Accelerator Application: Cohort Waitlist Notice",
    intro: "Thank you for your application. Due to cohort capacity limits, your proposal has been placed on our priority waitlist.",
  },
  accelerator_declined: {
    subject: "Graduate Accelerator Application Review Outcome",
    intro: "Thank you for submitting your research inquiry to the GradEdge Accelerator. We appreciate the opportunity to review your work.",
  },
  new_message_digest: {
    subject: "New Research Discussion in Your GradEdge Thread",
    intro: "You have unread research feedback and mentoring notes waiting in your project discussion thread.",
  },
  project_status_changed: {
    subject: "Research Project Update: Milestone Status Changed",
    intro: "An update has been recorded on your project timeline and research milestones.",
  },
  membership_renewal_notice: {
    subject: "Upcoming Membership Renewal — GradEdge Academic Solutions",
    intro: "Your GradEdge academic membership is scheduled for renewal in 3 days.",
  },
  membership_cancelled: {
    subject: "GradEdge Membership Cancellation Confirmation",
    intro: "Your membership subscription has been cancelled. You retain full portal access through the end of your billing cycle.",
  },
  newsletter_double_opt_in: {
    subject: "Confirm Your Subscription to the GradEdge Academic Dispatch",
    intro: "Please confirm your subscription to receive our bi-weekly dispatches on research methodology and scholarship.",
  },
  workshop_request_received: {
    subject: "Institutional Workshop Inquiry Received",
    intro: "Thank you for your institutional inquiry. Our academic partnerships team is reviewing your requested syllabus topics.",
  },
  resource_download_delivery: {
    subject: "Your Research Resource Download — GradEdge",
    intro: "Here is your requested academic research handbook and methodological guide.",
  },
  mentor_assigned: {
    subject: "Academic Mentor Appointed: Welcome to Your Research Guidance",
    intro: "We have appointed your dedicated research mentor based on their methodological specialization and field expertise.",
  },
};

/**
 * Get configured template settings (admin overrides with fallback to defaults)
 */
export async function getTemplateConfig(key: EmailTemplateKey): Promise<TemplateConfig> {
  const fallback = DEFAULT_EMAIL_TEMPLATES[key] || { subject: "GradEdge Academic Solutions", intro: "" };

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return fallback;
  }

  try {
    const supabase = createServiceRoleClient();
    const { data: setting } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "email_templates")
      .single();

    if (setting?.value && typeof setting.value === "object" && setting.value[key]) {
      const custom = setting.value[key];
      return {
        subject: custom.subject || fallback.subject,
        intro: custom.intro || fallback.intro,
      };
    }
  } catch (err) {
    // Silently fall back to built-in template on database unavailability
  }

  return fallback;
}

/**
 * Save updated template configurations (Admin only)
 */
export async function saveTemplateConfigs(configs: Record<string, TemplateConfig>): Promise<boolean> {
  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("settings").upsert({
      key: "email_templates",
      value: configs,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

