/**
 * GradEdge Resend Transactional Email Adapter
 * Supports branded HTML layout, plain text fallback, admin template overrides, and mock execution mode.
 */

import { renderBrandedLayout, EmailLayoutOptions } from "./layout";
import {
  getTemplateConfig,
  saveTemplateConfigs,
  DEFAULT_EMAIL_TEMPLATES,
  EmailTemplateKey,
  TemplateConfig,
} from "./settings";
import * as templates from "./templates";

export {
  renderBrandedLayout,
  getTemplateConfig,
  saveTemplateConfigs,
  DEFAULT_EMAIL_TEMPLATES,
  templates,
};

export type { EmailTemplateKey, TemplateConfig };

export interface EmailAttachment {
  filename: string;
  content: string; // base64 or utf8 string
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  attachments?: EmailAttachment[];
  isMarketing?: boolean;
}

export interface SendEmailResult {
  success: boolean;
  mocked?: boolean;
  data?: any;
  error?: any;
}

/**
 * Base email dispatcher.
 * When RESEND_API_KEY is not set:
 * - If MOCK_SERVICES=true (or non-production default), logs with [MOCK Email]
 * - If MOCK_SERVICES=false or NODE_ENV=production, throws/fails loudly.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const isMockAllowed = process.env.MOCK_SERVICES !== "false" && process.env.NODE_ENV !== "production";

  if (!apiKey) {
    if (isMockAllowed) {
      console.log(
        `[MOCK Email] To: ${Array.isArray(options.to) ? options.to.join(", ") : options.to} | Subject: "${options.subject}"`
      );
      return { success: true, mocked: true };
    }

    const err = new Error("RESEND_API_KEY environment variable is required to send emails in production.");
    console.error("[Email Fatal Error]", err);
    return { success: false, error: err.message };
  }

  const from = options.from || "GradEdge Academic Solutions <support@gradedge.com>";

  try {
    const payload: Record<string, unknown> = {
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    if (options.attachments && options.attachments.length > 0) {
      payload.attachments = options.attachments.map((att) => ({
        filename: att.filename,
        content: att.content.startsWith("data:") ? att.content : Buffer.from(att.content).toString("base64"),
      }));
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to deliver email through Resend");
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("[Email Error]", error);
    return { success: false, error: error.message || error };
  }
}

// ============================================================================
// TYPED EMAIL SENDERS (GRADEDGE TEMPLATES)
// ============================================================================

export async function sendWelcomeEmail({ to, name }: { to: string; name: string }) {
  const built = await templates.buildWelcomeEmail({ to, name });
  return sendEmail({ to, subject: built.subject, html: built.html, text: built.text });
}

export async function sendVerificationEmail({
  to,
  name,
  verifyUrl,
  token,
}: {
  to: string;
  name: string;
  verifyUrl: string;
  token?: string;
}) {
  const built = await templates.buildVerificationEmail({ to, name, verifyUrl, token });
  return sendEmail({ to, subject: built.subject, html: built.html, text: built.text });
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: {
  to: string;
  name: string;
  resetUrl: string;
}) {
  const built = await templates.buildPasswordResetEmail({ to, name, resetUrl });
  return sendEmail({ to, subject: built.subject, html: built.html, text: built.text });
}

export async function sendBookingConfirmationEmail({
  to,
  name,
  dateStr,
  timezone,
  meetingUrl,
  topic,
  icsContent,
  manageUrl,
}: {
  to: string;
  name: string;
  dateStr: string;
  timezone: string;
  meetingUrl: string;
  topic?: string;
  icsContent?: string;
  manageUrl?: string;
}) {
  const built = await templates.buildConsultationConfirmedEmail({
    to,
    name,
    dateStr,
    timezone,
    meetingUrl,
    topic,
  });

  const attachments: EmailAttachment[] = [];
  if (icsContent) {
    attachments.push({
      filename: "gradedge-consultation.ics",
      content: Buffer.from(icsContent).toString("base64"),
    });
  }

  return sendEmail({
    to,
    subject: built.subject,
    html: built.html,
    text: built.text,
    attachments: attachments.length > 0 ? attachments : undefined,
  });
}

export async function sendBookingAdminNotificationEmail({
  guestName,
  guestEmail,
  dateStr,
  timezone,
  studyLevel,
  fieldOfStudy,
  needs,
  message,
  topicHelp,
  meetingUrl,
}: {
  guestName: string;
  guestEmail: string;
  dateStr: string;
  timezone: string;
  studyLevel?: string;
  fieldOfStudy?: string;
  needs?: string;
  message?: string;
  topicHelp?: string;
  meetingUrl?: string;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admin@gradedge.com";
  const bodyHtml = `
    <p>A new 20-minute scoping consultation has been booked:</p>
    <div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; padding: 14px 18px; margin: 18px 0; border-radius: 2px;">
      <p style="margin: 0 0 4px 0;"><strong>Candidate:</strong> ${guestName} (${guestEmail})</p>
      <p style="margin: 0 0 4px 0;"><strong>Date and Time:</strong> ${dateStr} (${timezone})</p>
      <p style="margin: 0 0 4px 0;"><strong>Academic Level:</strong> ${studyLevel || "Not provided"}</p>
      <p style="margin: 0 0 4px 0;"><strong>Discipline:</strong> ${fieldOfStudy || "Not provided"}</p>
      <p style="margin: 0 0 4px 0;"><strong>Focus:</strong> ${needs || topicHelp || "Advisory"}</p>
      ${message ? `<p style="margin: 6px 0 0 0; padding-top: 6px; border-top: 1px dashed #E4DFD5;"><strong>Candidate Note:</strong> ${message}</p>` : ""}
    </div>
  `;

  const { html, text } = renderBrandedLayout({
    title: `New Consultation: ${guestName} (${dateStr})`,
    bodyHtml,
    reason: "Administrative booking notification for GradEdge advisory desk.",
  });

  return sendEmail({
    to: adminEmail,
    subject: `[Admin Alert] New Consultation Booked: ${guestName}`,
    html,
    text,
  });
}

export async function sendBookingReminderEmail({
  to,
  name,
  dateStr,
  timezone,
  meetingUrl,
  hoursBefore = 24,
}: {
  to: string;
  name: string;
  dateStr: string;
  timezone: string;
  meetingUrl: string;
  hoursBefore?: 24 | 1;
}) {
  const built = await templates.buildSessionReminderEmail({
    to,
    name,
    dateStr,
    timezone,
    meetingUrl,
    hoursBefore,
  });

  return sendEmail({ to, subject: built.subject, html: built.html, text: built.text });
}

export async function sendBookingCancellationEmail({
  to,
  name,
  action = "cancelled",
  dateStr,
  timezone,
  reason,
  rescheduleUrl,
}: {
  to: string;
  name: string;
  action?: "cancelled" | "rescheduled";
  dateStr: string;
  timezone: string;
  reason?: string;
  rescheduleUrl?: string;
}) {
  const built = await templates.buildBookingStatusEmail({
    to,
    name,
    action,
    dateStr,
    timezone,
    reason,
    rescheduleUrl,
  });

  return sendEmail({ to, subject: built.subject, html: built.html, text: built.text });
}

export async function sendPaymentReceiptEmail({
  to,
  name,
  customerName,
  invoiceNumber,
  formattedAmount,
  amountFormatted,
  currency = "USD",
  paymentReference = "",
  serviceName,
  paidAt,
  pdfBuffer,
  purposeDescription,
}: {
  to: string;
  name?: string;
  customerName?: string;
  invoiceNumber: string;
  formattedAmount?: string;
  amountFormatted?: string;
  currency?: string;
  paymentReference?: string;
  serviceName?: string;
  paidAt?: string;
  pdfBuffer?: Buffer | Uint8Array;
  purposeDescription?: string;
}) {
  const recipientName = name || customerName || "Researcher";
  const displayAmount = formattedAmount || amountFormatted || "Paid";
  const displayService = serviceName || purposeDescription || "Academic Advisory Service";
  const settledAt = paidAt || new Date().toLocaleDateString("en-US", { dateStyle: "medium" });
  const built = await templates.buildPaymentReceiptEmail({
    to,
    name: recipientName,
    invoiceNumber,
    formattedAmount: displayAmount,
    currency,
    paymentReference,
    serviceName: displayService,
    paidAt: settledAt,
  });

  const attachments: EmailAttachment[] = [];
  if (pdfBuffer) {
    attachments.push({
      filename: `GradEdge-Invoice-${invoiceNumber}.pdf`,
      content: Buffer.from(pdfBuffer).toString("base64"),
    });
  }

  return sendEmail({
    to,
    subject: built.subject,
    html: built.html,
    text: built.text,
    attachments: attachments.length > 0 ? attachments : undefined,
  });
}

export async function sendPaymentFailedEmail({
  to,
  name,
  serviceName,
  formattedAmount,
  retryUrl,
  reason,
}: {
  to: string;
  name: string;
  serviceName: string;
  formattedAmount: string;
  retryUrl?: string;
  reason?: string;
}) {
  const built = await templates.buildPaymentFailedEmail({
    to,
    name,
    serviceName,
    formattedAmount,
    retryUrl,
    reason,
  });
  return sendEmail({ to, subject: built.subject, html: built.html, text: built.text });
}

export async function sendRefundConfirmationEmail({
  to,
  name,
  customerName,
  amountStr,
  currency = "USD",
  paymentReference,
  serviceName = "Academic Advisory Service",
  reason,
  invoiceNumber,
  amountFormatted,
}: {
  to: string;
  name?: string;
  customerName?: string;
  amountStr?: string;
  currency?: string;
  paymentReference?: string;
  serviceName?: string;
  reason?: string;
  invoiceNumber?: string;
  amountFormatted?: string;
}) {
  const recipientName = name || customerName || "Researcher";
  const displayAmount = amountStr || amountFormatted || "Refunded";
  const displayRef = paymentReference || invoiceNumber || "N/A";
  const bodyHtml = `
    <p>Dear ${recipientName.split(" ")[0] || "Researcher"},</p>
    <p>A refund has been processed for your payment regarding <em>${serviceName}</em>.</p>
    <div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; padding: 14px 18px; margin: 18px 0; border-radius: 2px;">
      <p style="margin: 0 0 4px 0;"><strong>Refund Amount:</strong> ${displayAmount} (${currency})</p>
      <p style="margin: 0 0 4px 0;"><strong>Payment Reference:</strong> ${displayRef}</p>
      ${reason ? `<p style="margin: 4px 0 0 0;"><strong>Reason:</strong> ${reason}</p>` : ""}
    </div>
    <p style="font-size: 14px; color: #555555;">Funds generally settle in your originating account within 5–10 business days depending on your banking institution.</p>
  `;

  const { html, text } = renderBrandedLayout({
    title: "Refund Confirmation — GradEdge Academic Solutions",
    bodyHtml,
    reason: "A refund was processed on your account.",
  });

  return sendEmail({
    to,
    subject: `Refund Notice: ${serviceName}`,
    html,
    text,
  });
}

export async function sendAcceleratorApplicationAcknowledgement({
  to,
  name,
  studyLevel = "Post-Graduate Scholar",
  fieldOfStudy = "Academic Research Proposal",
  doctoralStage,
  topicSummary,
}: {
  to: string;
  name: string;
  studyLevel?: string;
  fieldOfStudy?: string;
  doctoralStage?: string;
  topicSummary?: string;
}) {
  const actualStudyLevel = doctoralStage ? `${studyLevel} (${doctoralStage})` : studyLevel;
  const actualField = fieldOfStudy || topicSummary || "Academic Research Proposal";
  const built = await templates.buildAcceleratorApplicationReceivedEmail({
    to,
    name,
    studyLevel: actualStudyLevel,
    fieldOfStudy: actualField,
  });
  return sendEmail({ to, subject: built.subject, html: built.html, text: built.text });
}

export async function sendAcceleratorAdminNotification({
  applicantName,
  name,
  applicantEmail,
  email,
  studyLevel = "Doctoral Candidate",
  fieldOfStudy = "Research Proposal",
  institution = "Academic Institution",
  proposalSummary,
  targetCompletion,
  doctoralStage,
  topicSummary,
}: {
  applicantName?: string;
  name?: string;
  applicantEmail?: string;
  email?: string;
  studyLevel?: string;
  fieldOfStudy?: string;
  institution?: string;
  proposalSummary?: string;
  targetCompletion?: string;
  doctoralStage?: string;
  topicSummary?: string;
  completedSummary?: string;
  desiredOutcomes?: string;
  preferredStart?: string;
}) {
  const candidateName = applicantName || name || "Applicant";
  const candidateEmail = applicantEmail || email || "unknown@domain.com";
  const displayLevel = doctoralStage ? `${studyLevel} (${doctoralStage})` : studyLevel;
  const displaySummary = proposalSummary || topicSummary || "";
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admin@gradedge.com";
  const bodyHtml = `
    <p>A new Graduate Accelerator dossier has been submitted:</p>
    <div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; padding: 14px 18px; margin: 18px 0; border-radius: 2px;">
      <p style="margin: 0 0 4px 0;"><strong>Candidate:</strong> ${candidateName} (${candidateEmail})</p>
      <p style="margin: 0 0 4px 0;"><strong>Institution:</strong> ${institution}</p>
      <p style="margin: 0 0 4px 0;"><strong>Degree Level:</strong> ${displayLevel}</p>
      <p style="margin: 0 0 4px 0;"><strong>Field:</strong> ${fieldOfStudy}</p>
      ${targetCompletion ? `<p style="margin: 0 0 4px 0;"><strong>Target Completion:</strong> ${targetCompletion}</p>` : ""}
      ${displaySummary ? `<p style="margin: 6px 0 0 0; padding-top: 6px; border-top: 1px dashed #E4DFD5;"><strong>Proposal:</strong> ${displaySummary}</p>` : ""}
    </div>
  `;

  const { html, text } = renderBrandedLayout({
    title: `New Accelerator Application: ${candidateName}`,
    bodyHtml,
    reason: "Internal advisory notification.",
  });

  return sendEmail({
    to: adminEmail,
    subject: `[Admin Alert] Accelerator Application: ${candidateName}`,
    html,
    text,
  });
}

export async function sendAcceleratorAcceptanceEmail({
  to,
  name,
  paymentUrl,
  cohortTerm,
  deadlineStr,
  note,
}: {
  to: string;
  name: string;
  paymentUrl: string;
  cohortTerm?: string;
  deadlineStr?: string;
  note?: string;
}) {
  const built = await templates.buildAcceleratorAcceptedEmail({
    to,
    name,
    paymentUrl,
    cohortTerm,
    deadlineStr,
  });
  return sendEmail({ to, subject: built.subject, html: built.html, text: built.text });
}

export async function sendAcceleratorWaitlistedEmail({
  to,
  name,
  fieldOfStudy,
}: {
  to: string;
  name: string;
  fieldOfStudy?: string;
}) {
  const built = await templates.buildAcceleratorWaitlistedEmail({ to, name, fieldOfStudy });
  return sendEmail({ to, subject: built.subject, html: built.html, text: built.text });
}

export async function sendAcceleratorDeclinedEmail({
  to,
  name,
  fieldOfStudy,
}: {
  to: string;
  name: string;
  fieldOfStudy?: string;
}) {
  const built = await templates.buildAcceleratorDeclinedEmail({ to, name, fieldOfStudy });
  return sendEmail({ to, subject: built.subject, html: built.html, text: built.text });
}

export async function sendSupportRequestAdminNotification({
  studentName,
  studentEmail,
  category = "Research Support Request",
  subject,
  title,
  message,
  brief,
  filesCount = 0,
  serviceTitle,
  deadline,
  projectId,
}: {
  studentName: string;
  studentEmail: string;
  category?: string;
  subject?: string;
  title?: string;
  message?: string;
  brief?: string;
  filesCount?: number;
  serviceTitle?: string;
  deadline?: string;
  projectId?: string;
}) {
  const displaySubject = subject || title || "Support Request";
  const displayMessage = message || brief || "Support request submitted.";
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admin@gradedge.com";
  const bodyHtml = `
    <p>A new research support request has been submitted by an active candidate:</p>
    <div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; padding: 14px 18px; margin: 18px 0; border-radius: 2px;">
      <p style="margin: 0 0 4px 0;"><strong>Author:</strong> ${studentName} (${studentEmail})</p>
      <p style="margin: 0 0 4px 0;"><strong>Category:</strong> ${category}${serviceTitle ? ` (${serviceTitle})` : ""}</p>
      <p style="margin: 0 0 4px 0;"><strong>Subject:</strong> ${displaySubject}</p>
      ${deadline ? `<p style="margin: 0 0 4px 0;"><strong>Target Deadline:</strong> ${deadline}</p>` : ""}
      <p style="margin: 0 0 4px 0;"><strong>Attachments:</strong> ${filesCount} file(s)</p>
      <p style="margin: 8px 0 0 0; padding-top: 8px; border-top: 1px dashed #E4DFD5;">${displayMessage}</p>
    </div>
  `;

  const { html, text } = renderBrandedLayout({
    title: `Support Inquiry: ${displaySubject}`,
    bodyHtml,
    reason: "Internal student desk notification.",
  });

  return sendEmail({
    to: adminEmail,
    subject: `[Student Request] ${category}: ${displaySubject}`,
    html,
    text,
  });
}

export async function sendNewMessageDigestEmail({
  to,
  name,
  senderName,
  threadSubject,
  messagePreview,
  threadUrl,
}: {
  to: string;
  name: string;
  senderName: string;
  threadSubject: string;
  messagePreview: string;
  threadUrl: string;
}) {
  const built = await templates.buildNewMessageDigestEmail({
    to,
    name,
    senderName,
    threadSubject,
    messagePreview,
    threadUrl,
  });
  return sendEmail({ to, subject: built.subject, html: built.html, text: built.text });
}

export async function sendProjectStatusChangedEmail({
  to,
  name,
  projectTitle,
  oldStatus,
  newStatus,
  mentorNotes,
  projectUrl,
}: {
  to: string;
  name: string;
  projectTitle: string;
  oldStatus: string;
  newStatus: string;
  mentorNotes?: string;
  projectUrl: string;
}) {
  const built = await templates.buildProjectStatusChangedEmail({
    to,
    name,
    projectTitle,
    oldStatus,
    newStatus,
    mentorNotes,
    projectUrl,
  });
  return sendEmail({ to, subject: built.subject, html: built.html, text: built.text });
}

export async function sendMembershipRenewalNoticeEmail({
  to,
  name,
  planName,
  renewalDateStr,
  formattedAmount,
  currency,
}: {
  to: string;
  name: string;
  planName: string;
  renewalDateStr: string;
  formattedAmount: string;
  currency: string;
}) {
  const built = await templates.buildMembershipRenewalNoticeEmail({
    to,
    name,
    planName,
    renewalDateStr,
    formattedAmount,
    currency,
  });
  return sendEmail({ to, subject: built.subject, html: built.html, text: built.text });
}

export async function sendMembershipCancelledEmail({
  to,
  name,
  planName,
  accessEndStr,
}: {
  to: string;
  name: string;
  planName: string;
  accessEndStr: string;
}) {
  const built = await templates.buildMembershipCancelledEmail({ to, name, planName, accessEndStr });
  return sendEmail({ to, subject: built.subject, html: built.html, text: built.text });
}

export async function sendNewsletterOptInEmail({
  to,
  confirmUrl,
}: {
  to: string;
  confirmUrl: string;
}) {
  const built = await templates.buildNewsletterOptInEmail({ to, confirmUrl });
  return sendEmail({ to, subject: built.subject, html: built.html, text: built.text, isMarketing: true });
}

export async function sendWorkshopRequestReceivedEmail({
  to,
  name,
  institution,
  topic,
  estimatedAttendees,
}: {
  to: string;
  name: string;
  institution: string;
  topic: string;
  estimatedAttendees?: string;
}) {
  const built = await templates.buildWorkshopRequestReceivedEmail({
    to,
    name,
    institution,
    topic,
    estimatedAttendees,
  });
  return sendEmail({ to, subject: built.subject, html: built.html, text: built.text });
}

export async function sendResourceDownloadEmail({
  to,
  name,
  resourceTitle,
  downloadUrl,
}: {
  to: string;
  name: string;
  resourceTitle: string;
  downloadUrl: string;
}) {
  const built = await templates.buildResourceDownloadEmail({
    to,
    name,
    resourceTitle,
    downloadUrl,
  });
  return sendEmail({ to, subject: built.subject, html: built.html, text: built.text });
}

export async function sendMentorAssignedEmail({
  to,
  studentName,
  mentorFirstName,
  mentorTitle,
  mentorBio,
  specialization,
  threadUrl,
}: {
  to: string;
  studentName: string;
  mentorFirstName: string;
  mentorTitle: string;
  mentorBio: string;
  specialization: string;
  threadUrl: string;
}) {
  const built = await templates.buildMentorAssignedEmail({
    to,
    studentName,
    mentorFirstName,
    mentorTitle,
    mentorBio,
    specialization,
    threadUrl,
  });
  return sendEmail({ to, subject: built.subject, html: built.html, text: built.text });
}
