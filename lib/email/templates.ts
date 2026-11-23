import { renderBrandedLayout } from "./layout";
import { getTemplateConfig, EmailTemplateKey } from "./settings";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gradedge.com";

// ============================================================================
// 1. WELCOME EMAIL
// ============================================================================
export async function buildWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const config = await getTemplateConfig("welcome");
  const firstName = name.split(" ")[0] || "Researcher";

  const bodyHtml = `
    <p>Dear ${escapeHtml(firstName)},</p>
    <p>Thank you for establishing your research account with GradEdge Academic Solutions. We are dedicated to providing honest, rigorous methodological guidance for post-graduate candidates, faculty, and independent scholars.</p>
    <p>From your student portal, you can:</p>
    <ul style="padding-left: 20px; margin: 16px 0;">
      <li style="margin-bottom: 8px;">Schedule one-on-one methodological consultations with experienced faculty mentors.</li>
      <li style="margin-bottom: 8px;">Upload working drafts, datasets, and chapter proposals for structured critique.</li>
      <li style="margin-bottom: 8px;">Track milestone deliverables and receive detailed line-by-line feedback.</li>
    </ul>
    <p style="margin: 28px 0;">
      <a href="${SITE_URL}/student" style="background-color: #14263F; color: #FFFFFF; text-decoration: none; padding: 12px 24px; font-weight: 500; font-size: 14px; border-radius: 2px; display: inline-block;">
        Enter Your Student Portal &rarr;
      </a>
    </p>
    <p style="font-size: 14px; color: #555555;">If you have any initial questions or require guidance scoping your research questions, our academic desk is accessible directly by replying to this email.</p>
  `;

  return {
    subject: config.subject,
    ...renderBrandedLayout({
      title: config.subject,
      customIntro: config.intro,
      bodyHtml,
      reason: "You registered for a student account on gradedge.com.",
    }),
  };
}

// ============================================================================
// 2. EMAIL VERIFICATION
// ============================================================================
export async function buildVerificationEmail({
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
  const config = await getTemplateConfig("email_verification");
  const firstName = name.split(" ")[0] || "Researcher";

  const bodyHtml = `
    <p>Dear ${escapeHtml(firstName)},</p>
    <p>To confirm your email address and activate your research portal, please select the verification link below:</p>
    <p style="margin: 28px 0;">
      <a href="${verifyUrl}" style="background-color: #14263F; color: #FFFFFF; text-decoration: none; padding: 12px 24px; font-weight: 500; font-size: 14px; border-radius: 2px; display: inline-block;">
        Verify Email Address &rarr;
      </a>
    </p>
    ${
      token
        ? `<p style="font-size: 13px; color: #555555;">Alternatively, enter this verification code directly on the confirmation screen: <strong style="font-family: monospace; font-size: 16px; color: #14263F; letter-spacing: 2px; background: #FAF8F4; padding: 4px 8px; border: 1px solid #E4DFD5;">${escapeHtml(token)}</strong></p>`
        : ""
    }
    <p style="font-size: 13px; color: #666666;">This link will expire in 24 hours. If you did not create a GradEdge account, please disregard this notice.</p>
  `;

  return {
    subject: config.subject,
    ...renderBrandedLayout({
      title: config.subject,
      customIntro: config.intro,
      bodyHtml,
      reason: "An account was created on gradedge.com using this email address.",
    }),
  };
}

// ============================================================================
// 3. PASSWORD RESET
// ============================================================================
export async function buildPasswordResetEmail({
  to,
  name,
  resetUrl,
}: {
  to: string;
  name: string;
  resetUrl: string;
}) {
  const config = await getTemplateConfig("password_reset");
  const firstName = name.split(" ")[0] || "Researcher";

  const bodyHtml = `
    <p>Dear ${escapeHtml(firstName)},</p>
    <p>A request was received to reset the authentication password associated with your GradEdge research portal.</p>
    <p style="margin: 28px 0;">
      <a href="${resetUrl}" style="background-color: #14263F; color: #FFFFFF; text-decoration: none; padding: 12px 24px; font-weight: 500; font-size: 14px; border-radius: 2px; display: inline-block;">
        Choose New Password &rarr;
      </a>
    </p>
    <p style="font-size: 13px; color: #666666;">This secure link is valid for 1 hour. If you did not request a password reset, your login credentials remain secure and no further action is necessary.</p>
  `;

  return {
    subject: config.subject,
    ...renderBrandedLayout({
      title: config.subject,
      customIntro: config.intro,
      bodyHtml,
      reason: "A password reset was requested for your account on gradedge.com.",
    }),
  };
}

// ============================================================================
// 4. CONSULTATION CONFIRMED
// ============================================================================
export async function buildConsultationConfirmedEmail({
  to,
  name,
  dateStr,
  timezone,
  meetingUrl,
  topic,
}: {
  to: string;
  name: string;
  dateStr: string;
  timezone: string;
  meetingUrl: string;
  topic?: string;
}) {
  const config = await getTemplateConfig("consultation_confirmed");
  const firstName = name.split(" ")[0] || "Researcher";

  const bodyHtml = `
    <p>Dear ${escapeHtml(firstName)},</p>
    <p>Your 20-minute academic scoping consultation has been successfully scheduled. We look forward to reviewing your methodological questions.</p>
    <div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; padding: 16px 20px; margin: 20px 0; border-radius: 2px;">
      <table style="width: 100%; font-size: 14px; line-height: 1.8;">
        <tr>
          <td style="width: 110px; color: #555555; vertical-align: top;"><strong>Date and Time:</strong></td>
          <td style="color: #14263F; font-weight: 600;">${escapeHtml(dateStr)} (${escapeHtml(timezone)})</td>
        </tr>
        ${
          topic
            ? `<tr>
                <td style="color: #555555; vertical-align: top;"><strong>Focus Area:</strong></td>
                <td style="color: #2B2B2B;">${escapeHtml(topic)}</td>
              </tr>`
            : ""
        }
        <tr>
          <td style="color: #555555; vertical-align: top;"><strong>Meeting Link:</strong></td>
          <td><a href="${meetingUrl}" style="color: #14263F; text-decoration: underline; word-break: break-all;">${escapeHtml(meetingUrl)}</a></td>
        </tr>
      </table>
    </div>
    <p style="font-size: 14px;"><strong>Recommended Preparation:</strong> Have your current research question, working hypothesis, or draft outline open during the call. A calendar invitation file (.ics) is attached to this email.</p>
  `;

  return {
    subject: config.subject,
    ...renderBrandedLayout({
      title: config.subject,
      customIntro: config.intro,
      bodyHtml,
      reason: "You scheduled an advisory consultation session on gradedge.com.",
    }),
  };
}

// ============================================================================
// 5. SESSION REMINDERS (24h and 1h)
// ============================================================================
export async function buildSessionReminderEmail({
  to,
  name,
  dateStr,
  timezone,
  meetingUrl,
  hoursBefore,
}: {
  to: string;
  name: string;
  dateStr: string;
  timezone: string;
  meetingUrl: string;
  hoursBefore: 24 | 1;
}) {
  const templateKey: EmailTemplateKey = hoursBefore === 24 ? "session_reminder_24h" : "session_reminder_1h";
  const config = await getTemplateConfig(templateKey);
  const firstName = name.split(" ")[0] || "Researcher";

  const headline = hoursBefore === 24 ? "Reminder: Your Advisory Session Tomorrow" : "Reminder: Advisory Session in 1 Hour";

  const bodyHtml = `
    <p>Dear ${escapeHtml(firstName)},</p>
    <p>${
      hoursBefore === 24
        ? `This is a reminder that your 20-minute research consultation is scheduled for tomorrow, <strong>${escapeHtml(dateStr)} (${escapeHtml(timezone)})</strong>.`
        : `Your 20-minute research consultation begins in one hour at <strong>${escapeHtml(dateStr)} (${escapeHtml(timezone)})</strong>.`
    }</p>
    <div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; padding: 16px 20px; margin: 20px 0; border-radius: 2px;">
      <p style="margin: 0 0 10px 0; font-size: 14px;"><strong>Video Conference Room:</strong></p>
      <a href="${meetingUrl}" style="background-color: #14263F; color: #FFFFFF; text-decoration: none; padding: 10px 20px; font-size: 13px; font-weight: 500; border-radius: 2px; display: inline-block;">
        Join Meeting Room &rarr;
      </a>
      <p style="margin: 10px 0 0 0; font-size: 12px; color: #555555; word-break: break-all;">${escapeHtml(meetingUrl)}</p>
    </div>
    <p style="font-size: 13px; color: #555555;">If you need to reschedule or cannot attend, please notify our team promptly so your appointed advisor's slot can be reallocated.</p>
  `;

  return {
    subject: config.subject,
    ...renderBrandedLayout({
      title: headline,
      customIntro: config.intro,
      bodyHtml,
      reason: "You have a confirmed booking on gradedge.com.",
    }),
  };
}

// ============================================================================
// 6. BOOKING CANCELLED OR RESCHEDULED
// ============================================================================
export async function buildBookingStatusEmail({
  to,
  name,
  action,
  dateStr,
  timezone,
  reason,
  rescheduleUrl,
}: {
  to: string;
  name: string;
  action: "cancelled" | "rescheduled";
  dateStr: string;
  timezone: string;
  reason?: string;
  rescheduleUrl?: string;
}) {
  const config = await getTemplateConfig("booking_cancelled_or_rescheduled");
  const firstName = name.split(" ")[0] || "Researcher";
  const headline = action === "rescheduled" ? "Advisory Session Rescheduled" : "Advisory Session Cancelled";

  const bodyHtml = `
    <p>Dear ${escapeHtml(firstName)},</p>
    <p>Your research consultation previously set for <strong>${escapeHtml(dateStr)} (${escapeHtml(timezone)})</strong> has been ${action}.</p>
    ${
      reason
        ? `<div style="background: #FBF5E9; border-left: 3px solid #C8963E; padding: 12px 16px; margin: 18px 0; font-size: 14px;"><strong>Reason provided:</strong> ${escapeHtml(reason)}</div>`
        : ""
    }
    ${
      rescheduleUrl
        ? `<p style="margin: 24px 0;">
            <a href="${rescheduleUrl}" style="background-color: #14263F; color: #FFFFFF; text-decoration: none; padding: 12px 24px; font-size: 14px; border-radius: 2px; display: inline-block;">
              Select a New Date and Time &rarr;
            </a>
          </p>`
        : `<p style="font-size: 14px;">You may book another available time slot whenever convenient at <a href="${SITE_URL}/book" style="color: #14263F; text-decoration: underline;">gradedge.com/book</a>.</p>`
    }
  `;

  return {
    subject: `${config.subject}: ${headline}`,
    ...renderBrandedLayout({
      title: headline,
      customIntro: config.intro,
      bodyHtml,
      reason: "An update was made to your booking schedule on gradedge.com.",
    }),
  };
}

// ============================================================================
// 7. PAYMENT RECEIPT WITH INVOICE
// ============================================================================
export async function buildPaymentReceiptEmail({
  to,
  name,
  invoiceNumber,
  formattedAmount,
  currency,
  paymentReference,
  serviceName,
  paidAt,
}: {
  to: string;
  name: string;
  invoiceNumber: string;
  formattedAmount: string;
  currency: string;
  paymentReference: string;
  serviceName: string;
  paidAt: string;
}) {
  const config = await getTemplateConfig("payment_receipt");
  const firstName = name.split(" ")[0] || "Researcher";

  const bodyHtml = `
    <p>Dear ${escapeHtml(firstName)},</p>
    <p>Thank you for your payment. This email serves as your official receipt of payment for academic advisory services.</p>
    <div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; padding: 18px 22px; margin: 20px 0; border-radius: 2px;">
      <table style="width: 100%; font-size: 14px; line-height: 1.8;">
        <tr>
          <td style="color: #555555; width: 140px;"><strong>Invoice Number:</strong></td>
          <td style="color: #14263F; font-weight: 600;">${escapeHtml(invoiceNumber)}</td>
        </tr>
        <tr>
          <td style="color: #555555;"><strong>Service / Scope:</strong></td>
          <td style="color: #2B2B2B;">${escapeHtml(serviceName)}</td>
        </tr>
        <tr>
          <td style="color: #555555;"><strong>Amount Paid:</strong></td>
          <td style="color: #14263F; font-size: 16px; font-weight: bold;">${escapeHtml(formattedAmount)} (${escapeHtml(currency)})</td>
        </tr>
        <tr>
          <td style="color: #555555;"><strong>Reference:</strong></td>
          <td style="font-family: monospace; font-size: 12px; color: #555555;">${escapeHtml(paymentReference)}</td>
        </tr>
        <tr>
          <td style="color: #555555;"><strong>Date Settled:</strong></td>
          <td style="color: #2B2B2B;">${escapeHtml(paidAt)}</td>
        </tr>
      </table>
    </div>
    <p style="font-size: 14px;">An official PDF invoice receipt is attached to this transmission. You can also review your full transaction record inside the <a href="${SITE_URL}/student/billing" style="color: #14263F; text-decoration: underline;">Billing and Invoices</a> section of your dashboard.</p>
  `;

  return {
    subject: `${config.subject} (${invoiceNumber})`,
    ...renderBrandedLayout({
      title: `Payment Receipt: ${invoiceNumber}`,
      customIntro: config.intro,
      bodyHtml,
      reason: "You completed a transaction with GradEdge Academic Solutions.",
    }),
  };
}

// ============================================================================
// 8. PAYMENT FAILED
// ============================================================================
export async function buildPaymentFailedEmail({
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
  const config = await getTemplateConfig("payment_failed");
  const firstName = name.split(" ")[0] || "Researcher";

  const bodyHtml = `
    <p>Dear ${escapeHtml(firstName)},</p>
    <p>We were unable to complete your payment of <strong>${escapeHtml(formattedAmount)}</strong> for <em>${escapeHtml(serviceName)}</em>.</p>
    <div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; padding: 14px 18px; margin: 18px 0; border-radius: 2px;">
      <p style="margin: 0; font-size: 14px; color: #555555;"><strong>Gateway Notice:</strong> ${escapeHtml(reason || "The issuing bank or card provider declined the transaction.")}</p>
    </div>
    <p>Your session or project draft reservation is held temporarily. To ensure continuity with your academic mentor, please retry with another card or contact your financial institution:</p>
    <p style="margin: 26px 0;">
      <a href="${retryUrl || `${SITE_URL}/student/billing`}" style="background-color: #14263F; color: #FFFFFF; text-decoration: none; padding: 12px 24px; font-weight: 500; font-size: 14px; border-radius: 2px; display: inline-block;">
        Retry Payment &rarr;
      </a>
    </p>
  `;

  return {
    subject: config.subject,
    ...renderBrandedLayout({
      title: "Payment Transaction Notice",
      customIntro: config.intro,
      bodyHtml,
      reason: "A payment attempt was initiated under your account.",
    }),
  };
}

// ============================================================================
// 9. ACCELERATOR APPLICATION RECEIVED
// ============================================================================
export async function buildAcceleratorApplicationReceivedEmail({
  to,
  name,
  studyLevel,
  fieldOfStudy,
}: {
  to: string;
  name: string;
  studyLevel: string;
  fieldOfStudy: string;
}) {
  const config = await getTemplateConfig("accelerator_application_received");
  const firstName = name.split(" ")[0] || "Researcher";

  const bodyHtml = `
    <p>Dear ${escapeHtml(firstName)},</p>
    <p>Thank you for submitting your application to the GradEdge Graduate Accelerator program. The academic review committee has received your dossier.</p>
    <div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; padding: 14px 18px; margin: 18px 0; border-radius: 2px;">
      <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Academic Level:</strong> ${escapeHtml(studyLevel)}</p>
      <p style="margin: 0; font-size: 14px;"><strong>Field of Study:</strong> ${escapeHtml(fieldOfStudy)}</p>
    </div>
    <p style="font-size: 14px;">Our faculty panel evaluates each proposal for methodological alignment, research feasibility, and mentor specialization match. You will receive an admissions decision within <strong>3 business days</strong>.</p>
  `;

  return {
    subject: config.subject,
    ...renderBrandedLayout({
      title: "Accelerator Dossier Received",
      customIntro: config.intro,
      bodyHtml,
      reason: "You submitted an application to the Graduate Accelerator at gradedge.com.",
    }),
  };
}

// ============================================================================
// 10. ACCELERATOR ACCEPTED WITH PAYMENT LINK
// ============================================================================
export async function buildAcceleratorAcceptedEmail({
  to,
  name,
  paymentUrl,
  cohortTerm,
  deadlineStr,
}: {
  to: string;
  name: string;
  paymentUrl: string;
  cohortTerm?: string;
  deadlineStr?: string;
}) {
  const config = await getTemplateConfig("accelerator_accepted");
  const firstName = name.split(" ")[0] || "Researcher";

  const bodyHtml = `
    <p>Dear ${escapeHtml(firstName)},</p>
    <p>On behalf of the academic advisory committee, we are pleased to inform you that your research proposal has been accepted for admission into the <strong>GradEdge Graduate Accelerator</strong>${cohortTerm ? ` (${escapeHtml(cohortTerm)})` : ""}.</p>
    <p>Your enrollment includes dedicated weekly 1-on-1 methodology mentoring, unlimited developmental manuscript reviews, statistical scoping, and structured milestone tracking to thesis defense.</p>
    <p style="margin: 28px 0;">
      <a href="${paymentUrl}" style="background-color: #14263F; color: #FFFFFF; text-decoration: none; padding: 13px 26px; font-weight: 500; font-size: 14px; border-radius: 2px; display: inline-block;">
        Secure Your Cohort Seat &rarr;
      </a>
    </p>
    ${
      deadlineStr
        ? `<p style="font-size: 13px; color: #555555;">Please complete your enrollment by <strong>${escapeHtml(deadlineStr)}</strong> to confirm placement before unreserved seats are extended to waitlisted candidates.</p>`
        : ""
    }
  `;

  return {
    subject: config.subject,
    ...renderBrandedLayout({
      title: "Admissions Offer: Graduate Accelerator",
      customIntro: config.intro,
      bodyHtml,
      reason: "Your application to the Graduate Accelerator was accepted.",
    }),
  };
}

// ============================================================================
// 11. ACCELERATOR WAITLISTED
// ============================================================================
export async function buildAcceleratorWaitlistedEmail({
  to,
  name,
  fieldOfStudy,
}: {
  to: string;
  name: string;
  fieldOfStudy?: string;
}) {
  const config = await getTemplateConfig("accelerator_waitlisted");
  const firstName = name.split(" ")[0] || "Researcher";

  const bodyHtml = `
    <p>Dear ${escapeHtml(firstName)},</p>
    <p>Thank you for submitting your research proposal for the Graduate Accelerator. The review committee was genuinely impressed with the scholarly merit of your inquiry in <em>${escapeHtml(fieldOfStudy || "your field")}</em>.</p>
    <p>To preserve our mentor-to-candidate ratio and guarantee intensive 1-on-1 guidance, each cohort is strictly limited in size. At present, our specialized faculty slots for this cohort are fully subscribed, and your application has been placed on our <strong>priority waitlist</strong>.</p>
    <p>If an enrolled candidate alters their schedule or additional faculty capacity opens, we will contact you immediately. In the interim, you may book individual chapter consultations or methodological reviews with our team without waiting for a cohort cycle.</p>
    <p style="margin: 24px 0;">
      <a href="${SITE_URL}/services" style="background-color: #14263F; color: #FFFFFF; text-decoration: none; padding: 11px 22px; font-size: 13px; border-radius: 2px; display: inline-block;">
        Explore Standalone Advisory Services &rarr;
      </a>
    </p>
  `;

  return {
    subject: config.subject,
    ...renderBrandedLayout({
      title: "Accelerator Application Status: Priority Waitlist",
      customIntro: config.intro,
      bodyHtml,
      reason: "You applied to the GradEdge Graduate Accelerator program.",
    }),
  };
}

// ============================================================================
// 12. ACCELERATOR DECLINED (KIND AND RESPECTFUL)
// ============================================================================
export async function buildAcceleratorDeclinedEmail({
  to,
  name,
  fieldOfStudy,
}: {
  to: string;
  name: string;
  fieldOfStudy?: string;
}) {
  const config = await getTemplateConfig("accelerator_declined");
  const firstName = name.split(" ")[0] || "Researcher";

  const bodyHtml = `
    <p>Dear ${escapeHtml(firstName)},</p>
    <p>Thank you for giving us the opportunity to review your research proposal in <em>${escapeHtml(fieldOfStudy || "your specialized discipline")}</em> for the upcoming Graduate Accelerator cohort.</p>
    <p>After careful deliberation by our faculty panel, we regret that we are unable to offer you admission into this specific cohort cycle. Our decisions often rest strictly on whether we have faculty mentors with exact methodological alignment in your specific research domain, rather than the scholarly merit or intrinsic value of your inquiry.</p>
    <p>We encourage you to continue advancing your inquiry with confidence. If you would benefit from targeted, standalone feedback on a specific manuscript chapter or statistical framework, our ad-hoc advisory sessions remain open to you at any time.</p>
    <p style="font-size: 14px; color: #555555;">We wish you every success in your academic journey and post-graduate achievements.</p>
  `;

  return {
    subject: config.subject,
    ...renderBrandedLayout({
      title: "Graduate Accelerator Review Outcome",
      customIntro: config.intro,
      bodyHtml,
      reason: "You submitted an application for the Graduate Accelerator at gradedge.com.",
    }),
  };
}

// ============================================================================
// 13. NEW MESSAGE DIGEST
// ============================================================================
export async function buildNewMessageDigestEmail({
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
  const config = await getTemplateConfig("new_message_digest");
  const firstName = name.split(" ")[0] || "Researcher";

  const bodyHtml = `
    <p>Dear ${escapeHtml(firstName)},</p>
    <p>You have received a new message in your research discussion thread from <strong>${escapeHtml(senderName)}</strong> regarding <em>"${escapeHtml(threadSubject)}"</em>:</p>
    <div style="background-color: #FAF8F4; border-left: 3px solid #14263F; padding: 14px 18px; margin: 18px 0; font-size: 14px; font-style: italic; color: #2B2B2B;">
      &ldquo;${escapeHtml(messagePreview.length > 280 ? messagePreview.slice(0, 277) + "..." : messagePreview)}&rdquo;
    </div>
    <p style="margin: 26px 0;">
      <a href="${threadUrl}" style="background-color: #14263F; color: #FFFFFF; text-decoration: none; padding: 12px 24px; font-weight: 500; font-size: 14px; border-radius: 2px; display: inline-block;">
        Reply in Research Portal &rarr;
      </a>
    </p>
    <p style="font-size: 13px; color: #666666;">To maintain a permanent, confidential academic record of your project guidance, all mentoring dialogues are archived securely within your portal.</p>
  `;

  return {
    subject: `${config.subject}: ${threadSubject}`,
    ...renderBrandedLayout({
      title: "New Research Mentoring Message",
      customIntro: config.intro,
      bodyHtml,
      reason: "You have an active research thread with an assigned mentor on gradedge.com.",
    }),
  };
}

// ============================================================================
// 14. PROJECT STATUS CHANGED
// ============================================================================
export async function buildProjectStatusChangedEmail({
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
  const config = await getTemplateConfig("project_status_changed");
  const firstName = name.split(" ")[0] || "Researcher";

  const bodyHtml = `
    <p>Dear ${escapeHtml(firstName)},</p>
    <p>An update has been logged on your research project <strong>&ldquo;${escapeHtml(projectTitle)}&rdquo;</strong>.</p>
    <div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; padding: 14px 18px; margin: 18px 0; border-radius: 2px;">
      <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Milestone Status:</strong> <span style="color: #555555;">${escapeHtml(oldStatus)}</span> &rarr; <strong style="color: #14263F;">${escapeHtml(newStatus)}</strong></p>
      ${
        mentorNotes
          ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: #333333; padding-top: 8px; border-top: 1px dashed #E4DFD5;"><strong>Mentor Feedback:</strong> ${escapeHtml(mentorNotes)}</p>`
          : ""
      }
    </div>
    <p style="margin: 26px 0;">
      <a href="${projectUrl}" style="background-color: #14263F; color: #FFFFFF; text-decoration: none; padding: 12px 24px; font-weight: 500; font-size: 14px; border-radius: 2px; display: inline-block;">
        View Project Workspace &rarr;
      </a>
    </p>
  `;

  return {
    subject: `${config.subject}: ${projectTitle}`,
    ...renderBrandedLayout({
      title: "Project Milestone Updated",
      customIntro: config.intro,
      bodyHtml,
      reason: "You are the primary author on an active project at gradedge.com.",
    }),
  };
}

// ============================================================================
// 15. MEMBERSHIP RENEWAL NOTICE
// ============================================================================
export async function buildMembershipRenewalNoticeEmail({
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
  const config = await getTemplateConfig("membership_renewal_notice");
  const firstName = name.split(" ")[0] || "Researcher";

  const bodyHtml = `
    <p>Dear ${escapeHtml(firstName)},</p>
    <p>This is a quiet advance notice that your <strong>${escapeHtml(planName)}</strong> membership is scheduled for its regular renewal on <strong>${escapeHtml(renewalDateStr)}</strong>.</p>
    <div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; padding: 14px 18px; margin: 18px 0; border-radius: 2px;">
      <p style="margin: 0; font-size: 14px;"><strong>Renewal Amount:</strong> ${escapeHtml(formattedAmount)} (${escapeHtml(currency)})</p>
    </div>
    <p style="font-size: 14px;">No action is required if you wish to maintain uninterrupted advisory access, office hours, and manuscript audits. You can manage or modify your subscription settings at any time in your student portal.</p>
    <p style="margin: 24px 0;">
      <a href="${SITE_URL}/student/billing" style="background-color: #14263F; color: #FFFFFF; text-decoration: none; padding: 11px 22px; font-size: 13px; border-radius: 2px; display: inline-block;">
        Review Membership Settings &rarr;
      </a>
    </p>
  `;

  return {
    subject: config.subject,
    ...renderBrandedLayout({
      title: "Upcoming Membership Renewal",
      customIntro: config.intro,
      bodyHtml,
      reason: "You maintain an active membership subscription at gradedge.com.",
    }),
  };
}

// ============================================================================
// 16. MEMBERSHIP CANCELLED
// ============================================================================
export async function buildMembershipCancelledEmail({
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
  const config = await getTemplateConfig("membership_cancelled");
  const firstName = name.split(" ")[0] || "Researcher";

  const bodyHtml = `
    <p>Dear ${escapeHtml(firstName)},</p>
    <p>Your subscription for the <strong>${escapeHtml(planName)}</strong> has been cancelled in accordance with your request.</p>
    <p style="font-size: 14px;">You will retain full access to all member benefits, office hour bookings, and archived feedback notes until the conclusion of your current billing period on <strong>${escapeHtml(accessEndStr)}</strong>. Subsequent renewal charges have been deactivated.</p>
    <p style="font-size: 14px; color: #555555;">All previously completed manuscripts, revisions, and project documents remain safely stored and accessible in your portal account.</p>
  `;

  return {
    subject: config.subject,
    ...renderBrandedLayout({
      title: "Membership Cancellation Confirmed",
      customIntro: config.intro,
      bodyHtml,
      reason: "You requested the cancellation of a membership subscription on gradedge.com.",
    }),
  };
}

// ============================================================================
// 17. NEWSLETTER DOUBLE OPT-IN
// ============================================================================
export async function buildNewsletterOptInEmail({
  to,
  confirmUrl,
}: {
  to: string;
  confirmUrl: string;
}) {
  const config = await getTemplateConfig("newsletter_double_opt_in");

  const bodyHtml = `
    <p>Greetings,</p>
    <p>Thank you for requesting to join the <strong>GradEdge Academic Dispatch</strong> — our bi-weekly publication addressing methodological design, quantitative pitfalls, academic prose clarity, and publication ethics.</p>
    <p>To prevent unsolicited subscriptions and protect your inbox, please confirm your interest by clicking the button below:</p>
    <p style="margin: 28px 0;">
      <a href="${confirmUrl}" style="background-color: #14263F; color: #FFFFFF; text-decoration: none; padding: 12px 24px; font-weight: 500; font-size: 14px; border-radius: 2px; display: inline-block;">
        Confirm Dispatch Subscription &rarr;
      </a>
    </p>
    <p style="font-size: 13px; color: #666666;">We maintain strict scholarly privacy: we never distribute subscriber information or send commercial advertising.</p>
  `;

  return {
    subject: config.subject,
    ...renderBrandedLayout({
      title: "Confirm Your Academic Subscription",
      customIntro: config.intro,
      bodyHtml,
      reason: "Someone entered this email address into our newsletter dispatch signup form.",
      isMarketing: true,
      unsubscribeUrl: `${SITE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(to)}`,
    }),
  };
}

// ============================================================================
// 18. WORKSHOP REQUEST RECEIVED
// ============================================================================
export async function buildWorkshopRequestReceivedEmail({
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
  const config = await getTemplateConfig("workshop_request_received");
  const firstName = name.split(" ")[0] || "Colleague";

  const bodyHtml = `
    <p>Dear ${escapeHtml(firstName)},</p>
    <p>Thank you for contacting GradEdge Academic Solutions regarding an institutional research workshop for <strong>${escapeHtml(institution)}</strong>.</p>
    <div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; padding: 14px 18px; margin: 18px 0; border-radius: 2px;">
      <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Proposed Focus / Topic:</strong> ${escapeHtml(topic)}</p>
      ${
        estimatedAttendees
          ? `<p style="margin: 0; font-size: 14px;"><strong>Estimated Cohort Size:</strong> ${escapeHtml(estimatedAttendees)} scholars</p>`
          : ""
      }
    </div>
    <p style="font-size: 14px;">Our partnerships director is reviewing your requirements and will reply within <strong>24 business hours</strong> with a tailored syllabus outline and scheduling options.</p>
  `;

  return {
    subject: config.subject,
    ...renderBrandedLayout({
      title: "Institutional Workshop Inquiry Received",
      customIntro: config.intro,
      bodyHtml,
      reason: "You submitted an institutional workshop request at gradedge.com.",
    }),
  };
}

// ============================================================================
// 19. RESOURCE DOWNLOAD DELIVERY
// ============================================================================
export async function buildResourceDownloadEmail({
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
  const config = await getTemplateConfig("resource_download_delivery");
  const firstName = name.split(" ")[0] || "Researcher";

  const bodyHtml = `
    <p>Dear ${escapeHtml(firstName)},</p>
    <p>Here is your requested academic publication: <strong>&ldquo;${escapeHtml(resourceTitle)}&rdquo;</strong>.</p>
    <p style="margin: 28px 0;">
      <a href="${downloadUrl}" style="background-color: #14263F; color: #FFFFFF; text-decoration: none; padding: 12px 24px; font-weight: 500; font-size: 14px; border-radius: 2px; display: inline-block;">
        Download PDF Guide &rarr;
      </a>
    </p>
    <p style="font-size: 13px; color: #555555;">This document is provided for individual scholarly use. You are welcome to cite and reference its methodological frameworks in your literature review.</p>
  `;

  return {
    subject: `${config.subject}: ${resourceTitle}`,
    ...renderBrandedLayout({
      title: "Research Resource Delivery",
      customIntro: config.intro,
      bodyHtml,
      reason: "You requested a research guide download at gradedge.com.",
    }),
  };
}

// ============================================================================
// 20. MENTOR ASSIGNED (INTRODUCES FIRST NAME and SHORT BIO)
// ============================================================================
export async function buildMentorAssignedEmail({
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
  const config = await getTemplateConfig("mentor_assigned");
  const firstName = studentName.split(" ")[0] || "Researcher";

  const bodyHtml = `
    <p>Dear ${escapeHtml(firstName)},</p>
    <p>We are pleased to introduce your appointed research mentor, <strong>${escapeHtml(mentorTitle)} ${escapeHtml(mentorFirstName)}</strong>, who will be overseeing your academic guidance.</p>
    <div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; padding: 20px 24px; margin: 20px 0; border-radius: 2px;">
      <h3 style="margin: 0 0 8px 0; font-family: Georgia, serif; font-size: 16px; color: #14263F;">
        ${escapeHtml(mentorTitle)} ${escapeHtml(mentorFirstName)}
      </h3>
      <p style="margin: 0 0 12px 0; font-size: 13px; color: #C8963E; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
        ${escapeHtml(specialization)}
      </p>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #333333;">
        ${escapeHtml(mentorBio)}
      </p>
    </div>
    <p style="font-size: 14px;">You may introduce yourself, outline your immediate dissertation milestones, and share draft questions directly via your private messaging thread:</p>
    <p style="margin: 26px 0;">
      <a href="${threadUrl}" style="background-color: #14263F; color: #FFFFFF; text-decoration: none; padding: 12px 24px; font-weight: 500; font-size: 14px; border-radius: 2px; display: inline-block;">
        Send Message to ${escapeHtml(mentorFirstName)} &rarr;
      </a>
    </p>
  `;

  return {
    subject: `${config.subject}: Meet ${mentorFirstName}`,
    ...renderBrandedLayout({
      title: "Your Research Mentor Has Been Appointed",
      customIntro: config.intro,
      bodyHtml,
      reason: "An academic mentor was assigned to your project at gradedge.com.",
    }),
  };
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
