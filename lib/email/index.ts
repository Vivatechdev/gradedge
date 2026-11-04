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
}

export async function sendEmail(options: SendEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(`[Email (Mock/Dev)] To: ${options.to} | Subject: ${options.subject}`);
    return { success: true, mocked: true };
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
      throw new Error(data.message || "Failed to send email");
    }

    return { success: true, data };
  } catch (error) {
    console.error("[Email Error]", error);
    return { success: false, error };
  }
}

function renderBrandedLayout({
  title,
  bodyHtml,
  siteUrl,
}: {
  title: string;
  bodyHtml: string;
  siteUrl: string;
}) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
</head>
<body style="font-family: Georgia, serif; color: #14263F; background-color: #FAF8F4; padding: 32px 16px; margin: 0; line-height: 1.6;">
  <div style="max-width: 560px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E4DFD5; padding: 36px 32px; border-radius: 4px;">
    <div style="border-bottom: 2px solid #C8963E; padding-bottom: 16px; margin-bottom: 24px;">
      <h2 style="margin: 0; font-size: 20px; font-weight: normal; color: #14263F; letter-spacing: -0.01em;">
        GradEdge <span style="font-size: 13px; color: #555555; text-transform: uppercase; font-family: sans-serif; letter-spacing: 0.1em; margin-left: 8px;">Academic Solutions</span>
      </h2>
    </div>

    ${bodyHtml}

    <p style="font-size: 14px; color: #555555; border-top: 1px solid #E4DFD5; padding-top: 20px; margin-top: 32px;">
      If you have questions, reply directly to this email.<br><br>
      <em>The GradEdge Advisory Team</em><br>
      <a href="${siteUrl}" style="color: #C8963E; text-decoration: none; font-size: 13px;">gradedge.com</a>
    </p>
  </div>
</body>
</html>`;
}

export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const firstName = name.split(" ")[0] || name;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const subject = "Welcome to GradEdge — Your Research Workspace";
  const text = `Dear ${firstName},

Welcome to GradEdge. Your researcher workspace is ready at ${siteUrl}/student.

Our approach is simple: we do not write your thesis, we mentor you through every chapter so that your final submission is defensible, rigorous, and completely your own.

You can now log in to upload draft excerpts, track research milestones, and review mentor notes.

If you have any questions before starting, reply directly to this email.
`;

  const bodyHtml = `
    <p style="font-size: 16px; margin-top: 0;">Dear ${firstName},</p>
    <p style="font-size: 15px;">Welcome to GradEdge. Your researcher workspace is ready.</p>
    <p style="font-size: 15px;">Our approach is straightforward: <strong>we do not write your thesis</strong>. We mentor you through every chapter, analysis, and defense preparation so that your final submission is methodologically defensible, rigorous, and completely your own.</p>
    <div style="margin: 28px 0; text-align: left;">
      <a href="${siteUrl}/student" style="background-color: #C8963E; color: #14263F; padding: 12px 24px; text-decoration: none; font-size: 14px; font-family: sans-serif; font-weight: 600; border-radius: 4px; display: inline-block;">
        Open Your Workspace &rarr;
      </a>
    </div>
    <p style="font-size: 14px; color: #555555;">You can now log in to upload draft excerpts, track research milestones, and review mentor notes.</p>
  `;

  const html = renderBrandedLayout({
    title: subject,
    bodyHtml,
    siteUrl,
  });

  return sendEmail({
    to,
    subject,
    text,
    html,
  });
}

export async function sendVerificationEmail({
  to,
  verificationUrl,
}: {
  to: string;
  verificationUrl: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const subject = "Confirm your GradEdge account";
  const text = `Please verify your email address to activate your GradEdge researcher account:

${verificationUrl}

If you did not create this account, you can safely ignore this email.
`;

  const bodyHtml = `
    <p style="font-size: 15px; margin-top: 0;">Hello,</p>
    <p style="font-size: 15px;">Please verify your email address to activate your GradEdge researcher account.</p>
    <div style="margin: 28px 0; text-align: left;">
      <a href="${verificationUrl}" style="background-color: #14263F; color: #FFFFFF; padding: 10px 20px; text-decoration: none; font-size: 13px; font-family: sans-serif; font-weight: 600; border-radius: 4px; display: inline-block;">
        Verify Email Address &rarr;
      </a>
    </div>
    <p style="font-size: 13px; color: #777;">If you did not sign up for GradEdge, you can safely ignore this message.</p>
  `;

  const html = renderBrandedLayout({
    title: subject,
    bodyHtml,
    siteUrl,
  });

  return sendEmail({
    to,
    subject,
    text,
    html,
  });
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: {
  to: string;
  resetUrl: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const subject = "Reset your password — GradEdge Academic Solutions";
  const text = `We received a request to reset your GradEdge account password. Use this link to set a new password:

${resetUrl}

If you did not request this, please disregard this email.
`;

  const bodyHtml = `
    <p style="font-size: 15px; margin-top: 0;">Hello,</p>
    <p style="font-size: 15px;">We received a request to reset your GradEdge account password. Click the button below to set a new password:</p>
    <div style="margin: 28px 0; text-align: left;">
      <a href="${resetUrl}" style="background-color: #14263F; color: #FFFFFF; padding: 10px 20px; text-decoration: none; font-size: 13px; font-family: sans-serif; font-weight: 600; border-radius: 4px; display: inline-block;">
        Reset Password &rarr;
      </a>
    </div>
    <p style="font-size: 13px; color: #777;">If you did not request a password reset, you can safely ignore this email.</p>
  `;

  const html = renderBrandedLayout({
    title: subject,
    bodyHtml,
    siteUrl,
  });

  return sendEmail({
    to,
    subject,
    text,
    html,
  });
}

// ── STAGE 6: CONSULTATION BOOKING EMAILS ─────────────────────────────────────

export async function sendBookingConfirmationEmail({
  to,
  name,
  dateStr,
  timezone,
  meetingUrl,
  manageUrl,
  icsContent,
}: {
  to: string;
  name: string;
  dateStr: string;
  timezone: string;
  meetingUrl: string;
  manageUrl: string;
  icsContent?: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const subject = "Confirmed: Your 20-minute GradEdge Consultation";
  const text = `Dear ${name},

Your 20-minute advisory consultation is confirmed:

Time: ${dateStr} (${timezone})
Meeting Link: ${meetingUrl}

We have attached a calendar (.ics) file so you can add this to your calendar.

What to prepare:
1. A brief summary of your research topic or question.
2. The specific chapter, methodology, or analysis giving you trouble.
3. Any immediate deadlines (committee review, proposal defense, etc.).

Need to reschedule or cancel? You can do so up to 6 hours before the call:
${manageUrl}

We look forward to speaking with you.
`;

  const bodyHtml = `
    <p style="font-size: 16px; margin-top: 0;">Dear ${name},</p>
    <p style="font-size: 15px;">Your 20-minute advisory consultation is confirmed.</p>
    
    <div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; border-left: 3px solid #C8963E; padding: 16px 20px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Scheduled Time:</strong> ${dateStr} (${timezone})</p>
      <p style="margin: 0; font-size: 14px;"><strong>Meeting Link:</strong> <a href="${meetingUrl}" style="color: #14263F; font-weight: 600;">${meetingUrl}</a></p>
    </div>

    <p style="font-size: 14px; margin-bottom: 8px;"><strong>What we will cover on the call:</strong></p>
    <ul style="font-size: 14px; color: #333333; padding-left: 20px; margin-top: 0;">
      <li>Where your dissertation or manuscript currently stands.</li>
      <li>Your methodology, data requirements, and software stack.</li>
      <li>An honest evaluation of whether we have the right disciplinary mentor.</li>
    </ul>

    <p style="font-size: 13px; color: #555555; margin-top: 24px;">
      A calendar invite (.ics) has been attached to this email. You can reschedule or cancel at any time up to 6 hours before the start:
    </p>
    <div style="margin: 16px 0;">
      <a href="${manageUrl}" style="background-color: #14263F; color: #FFFFFF; padding: 8px 16px; text-decoration: none; font-size: 12px; font-family: sans-serif; font-weight: 600; border-radius: 4px; display: inline-block;">
        Manage or Reschedule Booking &rarr;
      </a>
    </div>
  `;

  const html = renderBrandedLayout({
    title: subject,
    bodyHtml,
    siteUrl,
  });

  const attachments: EmailAttachment[] = [];
  if (icsContent) {
    attachments.push({
      filename: "gradedge-consultation.ics",
      content: icsContent,
    });
  }

  return sendEmail({
    to,
    subject,
    text,
    html,
    attachments,
  });
}

export async function sendBookingAdminNotificationEmail({
  guestName,
  guestEmail,
  studyLevel,
  topicHelp,
  message,
  dateStr,
  timezone,
  meetingUrl,
}: {
  guestName: string;
  guestEmail: string;
  studyLevel: string;
  topicHelp: string;
  message?: string;
  dateStr: string;
  timezone: string;
  meetingUrl: string;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admissions@gradedge.com";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const subject = `[New Booking] Consultation: ${guestName} (${studyLevel.toUpperCase()})`;
  const text = `A new free 20-minute consultation has been scheduled.

Visitor: ${guestName} (${guestEmail})
Study Level: ${studyLevel}
Needs Help With: ${topicHelp}
Message: ${message || "None"}
Scheduled Time: ${dateStr} (${timezone})
Meeting URL: ${meetingUrl}
`;

  const bodyHtml = `
    <p style="font-size: 16px; margin-top: 0;"><strong>New Free Consultation Scheduled</strong></p>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 16px 0;">
      <tr><td style="padding: 6px 0; color: #666; width: 140px;">Researcher:</td><td><strong>${guestName}</strong></td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Email:</td><td><a href="mailto:${guestEmail}">${guestEmail}</a></td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Study Level:</td><td>${studyLevel}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Topic / Focus:</td><td>${topicHelp}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Message:</td><td>${message || "—"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Scheduled For:</td><td><strong>${dateStr} (${timezone})</strong></td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Room Link:</td><td><a href="${meetingUrl}">${meetingUrl}</a></td></tr>
    </table>
  `;

  const html = renderBrandedLayout({
    title: subject,
    bodyHtml,
    siteUrl,
  });

  return sendEmail({
    to: adminEmail,
    subject,
    text,
    html,
  });
}

export async function sendBookingReminderEmail({
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const subject =
    hoursBefore === 24
      ? "Reminder: Your GradEdge Consultation is Tomorrow"
      : "Reminder: Your GradEdge Consultation Starts in 1 Hour";

  const text = `Dear ${name},

This is a reminder that your 20-minute advisory consultation begins ${
    hoursBefore === 24 ? "tomorrow" : "in 1 hour"
  } at ${dateStr} (${timezone}).

Meeting Link: ${meetingUrl}

We look forward to speaking with you.
`;

  const bodyHtml = `
    <p style="font-size: 16px; margin-top: 0;">Dear ${name},</p>
    <p style="font-size: 15px;">This is a quick reminder that your 20-minute advisory consultation starts ${
      hoursBefore === 24 ? "tomorrow" : "in 1 hour"
    }.</p>
    <div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; border-left: 3px solid #C8963E; padding: 16px 20px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Time:</strong> ${dateStr} (${timezone})</p>
      <p style="margin: 0; font-size: 14px;"><strong>Google Meet:</strong> <a href="${meetingUrl}" style="color: #14263F; font-weight: 600;">${meetingUrl}</a></p>
    </div>
    <p style="font-size: 14px;">Have your working draft, research questions, or methodology outline on hand.</p>
  `;

  const html = renderBrandedLayout({
    title: subject,
    bodyHtml,
    siteUrl,
  });

  return sendEmail({
    to,
    subject,
    text,
    html,
  });
}

export async function sendBookingCancellationEmail({
  to,
  name,
  dateStr,
  timezone,
  reason,
}: {
  to: string;
  name: string;
  dateStr: string;
  timezone: string;
  reason?: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const subject = "Consultation Cancelled — GradEdge Academic Solutions";
  const text = `Dear ${name},

Your consultation scheduled for ${dateStr} (${timezone}) has been successfully cancelled.

${reason ? `Reason: ${reason}\n\n` : ""}Your slot has been released. Whenever you are ready to reschedule, you can book a new call anytime at ${siteUrl}/book.
`;

  const bodyHtml = `
    <p style="font-size: 16px; margin-top: 0;">Dear ${name},</p>
    <p style="font-size: 15px;">Your consultation scheduled for <strong>${dateStr} (${timezone})</strong> has been cancelled.</p>
    ${reason ? `<p style="font-size: 14px; color: #555;">Reason: <em>${reason}</em></p>` : ""}
    <p style="font-size: 14px;">Your slot has been immediately released. When you are ready to book another call, you can schedule anytime:</p>
    <div style="margin: 20px 0;">
      <a href="${siteUrl}/book" style="background-color: #C8963E; color: #14263F; padding: 10px 20px; text-decoration: none; font-size: 13px; font-family: sans-serif; font-weight: 600; border-radius: 4px; display: inline-block;">
        Book a New Consultation &rarr;
      </a>
    </div>
  `;

  const html = renderBrandedLayout({
    title: subject,
    bodyHtml,
    siteUrl,
  });

  return sendEmail({
    to,
    subject,
    text,
    html,
  });
}

// ── STAGE 6: ACCELERATOR APPLICATION EMAILS ─────────────────────────────────

export async function sendAcceleratorApplicationAcknowledgement({
  to,
  name,
  doctoralStage,
  topicSummary,
}: {
  to: string;
  name: string;
  doctoralStage: string;
  topicSummary: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const firstName = name.split(" ")[0] || name;
  const subject = "We have received your Dissertation Accelerator application";

  const text = `Dear ${firstName},

Thank you for applying to the GradEdge Dissertation Accelerator.

We review every application manually to ensure methodological compatibility and verify that we have an active specialist in your discipline.

What happens next:
1. Academic Review: A lead advisor in your subject area will assess your topic outline and timeline.
2. Admissions Decision: You will receive our decision (Acceptance, Waitlist, or Feedback) within two business days.
3. If accepted, you will receive a secure payment link to confirm your cohort placement.

If you have any questions or additional draft materials to share in the meantime, reply directly to this email.
`;

  const bodyHtml = `
    <p style="font-size: 16px; margin-top: 0;">Dear ${firstName},</p>
    <p style="font-size: 15px;">Thank you for submitting your application to the GradEdge Dissertation Accelerator.</p>
    <p style="font-size: 15px;">We review every candidate personally. We do not operate on automated acceptance algorithms: we verify that your research questions, methodologies, and completion timeline match our faculty specializations.</p>
    
    <div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; padding: 16px 20px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0 0 6px 0; font-size: 13px; color: #555;"><strong>Doctoral Stage:</strong> ${doctoralStage}</p>
      <p style="margin: 0; font-size: 13px; color: #555;"><strong>Research Focus:</strong> ${topicSummary.slice(0, 180)}...</p>
    </div>

    <p style="font-size: 14px; margin-bottom: 8px;"><strong>What happens next:</strong></p>
    <ol style="font-size: 14px; color: #333333; padding-left: 20px; margin-top: 0;">
      <li style="margin-bottom: 6px;"><strong>Faculty Evaluation:</strong> A senior methodologist in your discipline evaluates your research status.</li>
      <li style="margin-bottom: 6px;"><strong>Admissions Notification:</strong> You will receive our admissions determination within 48 business hours.</li>
      <li><strong>Cohort Placement:</strong> If admitted, you will receive your cohort schedule and secure enrollment invitation.</li>
    </ol>
  `;

  const html = renderBrandedLayout({
    title: subject,
    bodyHtml,
    siteUrl,
  });

  return sendEmail({
    to,
    subject,
    text,
    html,
  });
}

export async function sendAcceleratorAdminNotification({
  name,
  email,
  institution,
  doctoralStage,
  topicSummary,
  completedSummary,
  desiredOutcomes,
  preferredStart,
}: {
  name: string;
  email: string;
  institution: string;
  doctoralStage: string;
  topicSummary: string;
  completedSummary: string;
  desiredOutcomes: string;
  preferredStart: string;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admissions@gradedge.com";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const subject = `[Accelerator Application] ${name} — ${institution} (${doctoralStage})`;
  const text = `A new application has been submitted to the Dissertation Accelerator.

Applicant: ${name} (${email})
Institution: ${institution}
Stage: ${doctoralStage}
Preferred Start: ${preferredStart}

Topic Summary:
${topicSummary}

Completed So Far:
${completedSummary}

Desired Outcomes:
${desiredOutcomes}
`;

  const bodyHtml = `
    <p style="font-size: 16px; margin-top: 0;"><strong>New Dissertation Accelerator Application</strong></p>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 16px 0;">
      <tr><td style="padding: 6px 0; color: #666; width: 140px;">Applicant:</td><td><strong>${name}</strong></td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Email:</td><td><a href="mailto:${email}">${email}</a></td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Institution:</td><td>${institution}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Doctoral Stage:</td><td>${doctoralStage}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Preferred Start:</td><td>${preferredStart}</td></tr>
    </table>
    <div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; padding: 12px 16px; margin-top: 12px; border-radius: 4px; font-size: 13px;">
      <p style="margin: 0 0 6px 0;"><strong>Topic Summary:</strong></p>
      <p style="margin: 0 0 12px 0; color: #333;">${topicSummary}</p>
      <p style="margin: 0 0 6px 0;"><strong>Completed So Far:</strong></p>
      <p style="margin: 0 0 12px 0; color: #333;">${completedSummary}</p>
      <p style="margin: 0 0 6px 0;"><strong>Desired Outcomes:</strong></p>
      <p style="margin: 0; color: #333;">${desiredOutcomes}</p>
    </div>
  `;

  const html = renderBrandedLayout({
    title: subject,
    bodyHtml,
    siteUrl,
  });

  return sendEmail({
    to: adminEmail,
    subject,
    text,
    html,
  });
}

export async function sendAcceleratorAcceptanceEmail({
  to,
  name,
  paymentUrl,
  note,
}: {
  to: string;
  name: string;
  paymentUrl: string;
  note?: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const firstName = name.split(" ")[0] || name;
  const subject = "Congratulations: Admission to the GradEdge Dissertation Accelerator";

  const text = `Dear ${firstName},

We are pleased to inform you that your application to the GradEdge Dissertation Accelerator has been accepted.

${note ? `Admissions Faculty Note: ${note}\n\n` : ""}To confirm your placement in your cohort, please finalize your enrollment using this secure link:
${paymentUrl}

We look forward to working with you.
`;

  const bodyHtml = `
    <p style="font-size: 16px; margin-top: 0;">Dear ${firstName},</p>
    <p style="font-size: 15px;">We are pleased to offer you admission to the <strong>GradEdge Dissertation Accelerator</strong>.</p>
    ${
      note
        ? `<div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; border-left: 3px solid #C8963E; padding: 12px 16px; margin: 16px 0; font-size: 13px; border-radius: 4px;">
            <strong>Admissions Faculty Note:</strong><br>${note}
          </div>`
        : ""
    }
    <p style="font-size: 14px;">To confirm your seat in the upcoming cohort and activate your mentor matching, please complete your enrollment:</p>
    <div style="margin: 24px 0;">
      <a href="${paymentUrl}" style="background-color: #C8963E; color: #14263F; padding: 12px 24px; text-decoration: none; font-size: 14px; font-family: sans-serif; font-weight: 600; border-radius: 4px; display: inline-block;">
        Complete Enrollment &rarr;
      </a>
    </div>
  `;

  const html = renderBrandedLayout({
    title: subject,
    bodyHtml,
    siteUrl,
  });

  return sendEmail({
    to,
    subject,
    text,
    html,
  });
}

// ── STAGE 6: SUPPORT REQUEST NOTIFICATIONS ──────────────────────────────────

export async function sendSupportRequestAdminNotification({
  studentName,
  studentEmail,
  serviceTitle,
  title,
  brief,
  deadline,
  projectId,
}: {
  studentName: string;
  studentEmail: string;
  serviceTitle: string;
  title: string;
  brief: string;
  deadline?: string;
  projectId: string;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admissions@gradedge.com";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const subject = `[Support Request] ${studentName} — ${serviceTitle}`;
  const text = `A logged-in student has submitted a new support request.

Student: ${studentName} (${studentEmail})
Service: ${serviceTitle}
Title: ${title}
Deadline: ${deadline || "None"}
Project ID: ${projectId}

Brief:
${brief}
`;

  const bodyHtml = `
    <p style="font-size: 16px; margin-top: 0;"><strong>New Student Support Request</strong></p>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 16px 0;">
      <tr><td style="padding: 6px 0; color: #666; width: 140px;">Student:</td><td><strong>${studentName}</strong></td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Email:</td><td><a href="mailto:${studentEmail}">${studentEmail}</a></td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Service:</td><td>${serviceTitle}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Request Title:</td><td><strong>${title}</strong></td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Target Deadline:</td><td>${deadline || "Flexible"}</td></tr>
    </table>
    <div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; padding: 12px 16px; margin-top: 12px; border-radius: 4px; font-size: 13px;">
      <p style="margin: 0 0 6px 0;"><strong>Description of Support Needed:</strong></p>
      <p style="margin: 0; color: #333; line-height: 1.5;">${brief}</p>
    </div>
  `;

  const html = renderBrandedLayout({
    title: subject,
    bodyHtml,
    siteUrl,
  });

  return sendEmail({
    to: adminEmail,
    subject,
    text,
    html,
  });
}


// ── STAGE 7: PAYMENTS & INVOICES NOTIFICATIONS ──────────────────────────────

export async function sendPaymentReceiptEmail({
  to,
  customerName,
  invoiceNumber,
  amountFormatted,
  purposeDescription,
  paymentReference,
  pdfBuffer,
  invoiceUrl,
}: {
  to: string;
  customerName: string;
  invoiceNumber: string;
  amountFormatted: string;
  purposeDescription: string;
  paymentReference: string;
  pdfBuffer?: Buffer;
  invoiceUrl?: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const subject = `Payment Confirmed: Invoice ${invoiceNumber} — GradEdge`;

  const text = `Dear ${customerName},

Thank you for your payment. Your transaction has been confirmed and settled.

Deliverable / Purpose: ${purposeDescription}
Amount Settled: ${amountFormatted}
Invoice Number: ${invoiceNumber}
Transaction Reference: ${paymentReference}

${invoiceUrl ? `You can download your official PDF tax invoice here: ${invoiceUrl}\n` : ""}
Your intellectual property and academic authorship remain 100% yours. All mentoring strictly complies with university integrity codes.

Warm regards,
GradEdge Finance Desk
`;

  const bodyHtml = `
    <p style="font-size: 16px; margin-top: 0;">Dear <strong>${customerName}</strong>,</p>
    <p style="line-height: 1.6; color: #333;">
      Thank you for your payment. Your transaction has been successfully confirmed.
    </p>

    <div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; border-radius: 4px; padding: 16px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 6px 0; color: #666; width: 140px;">Deliverable:</td><td><strong>${purposeDescription}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Amount Settled:</td><td><strong style="color: #14263F; font-size: 16px;">${amountFormatted}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Invoice Number:</td><td><strong style="font-family: monospace;">${invoiceNumber}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Reference:</td><td><span style="font-family: monospace; font-size: 12px; color: #666;">${paymentReference}</span></td></tr>
      </table>
    </div>

    ${
      invoiceUrl
        ? `<p style="margin: 20px 0;">
            <a href="${invoiceUrl}" style="background-color: #14263F; color: #FAF8F4; text-decoration: none; padding: 10px 18px; border-radius: 4px; font-weight: 600; display: inline-block;">
              Download Official PDF Invoice
            </a>
          </p>`
        : ""
    }

    <p style="font-size: 12px; color: #666; line-height: 1.5; border-top: 1px solid #E4DFD5; padding-top: 12px;">
      All mentoring services are developmental and pedagogic. Authorship of your dissertation, research data, and final thesis remains completely yours.
    </p>
  `;

  const html = renderBrandedLayout({
    title: subject,
    bodyHtml,
    siteUrl,
  });

  const attachments: EmailAttachment[] = [];
  if (pdfBuffer) {
    attachments.push({
      filename: `${invoiceNumber}.pdf`,
      content: `data:application/pdf;base64,${pdfBuffer.toString("base64")}`,
    });
  }

  return sendEmail({
    to,
    subject,
    text,
    html,
    attachments: attachments.length > 0 ? attachments : undefined,
  });
}

export async function sendRefundConfirmationEmail({
  to,
  customerName,
  invoiceNumber,
  amountFormatted,
  reason,
}: {
  to: string;
  customerName: string;
  invoiceNumber: string;
  amountFormatted: string;
  reason: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const subject = `Refund Processed: ${invoiceNumber} — GradEdge`;

  const text = `Dear ${customerName},

We have processed a refund of ${amountFormatted} for invoice ${invoiceNumber}.

Reason: ${reason}

The credit will appear on your original payment card / account in accordance with standard banking settlement times (typically 3-7 business days).

If you have questions, please reply directly to this email.

Warm regards,
GradEdge Finance Desk
`;

  const bodyHtml = `
    <p style="font-size: 16px; margin-top: 0;">Dear <strong>${customerName}</strong>,</p>
    <p style="line-height: 1.6; color: #333;">
      We have processed a refund for your transaction.
    </p>

    <div style="background-color: #FAF8F4; border: 1px solid #E4DFD5; border-radius: 4px; padding: 16px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 6px 0; color: #666; width: 140px;">Invoice Number:</td><td><strong style="font-family: monospace;">${invoiceNumber}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Refund Amount:</td><td><strong style="color: #14263F; font-size: 16px;">${amountFormatted}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Reason:</td><td>${reason}</td></tr>
      </table>
    </div>

    <p style="font-size: 13px; color: #555; line-height: 1.5;">
      The funds have been credited back to your original payment method. Depending on your banking institution, this typically reflects within 3 to 7 business days.
    </p>
  `;

  const html = renderBrandedLayout({
    title: subject,
    bodyHtml,
    siteUrl,
  });

  return sendEmail({
    to,
    subject,
    text,
    html,
  });
}
