export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export async function sendEmail(options: SendEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY is not set. Email not sent.");
    return { success: false, error: "Missing RESEND_API_KEY" };
  }

  const from = options.from || "GradEdge Academic Solutions <support@gradedge.com>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
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
  <div style="max-width: 560px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E4DFD5; padding: 36px 32px; border-radius: 2px;">
    <div style="border-bottom: 2px solid #C8963E; padding-bottom: 16px; margin-bottom: 24px;">
      <h2 style="margin: 0; font-size: 20px; font-weight: normal; color: #14263F; letter-spacing: -0.01em;">
        GradEdge <span style="font-size: 13px; color: #555555; text-transform: uppercase; font-family: sans-serif; letter-spacing: 0.1em; margin-left: 8px;">Academic Solutions</span>
      </h2>
    </div>

    ${bodyHtml}

    <p style="font-size: 14px; color: #555555; border-top: 1px solid #E4DFD5; padding-top: 20px; margin-top: 32px;">
      If you have questions, simply reply to this email.<br><br>
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

With academic regards,
The GradEdge Advisory Team
support@gradedge.com
`;

  const bodyHtml = `
    <p style="font-size: 15px; margin-top: 0;">Dear ${firstName},</p>
    <p style="font-size: 15px;">Welcome to GradEdge. Your researcher workspace is ready.</p>
    <p style="font-size: 15px;">
      Our approach is simple: <strong>we do not write your thesis.</strong> We coach you through every draft, chapter, and analysis script so that your final submission is methodologically defensible, rigorous, and completely your own work.
    </p>
    <div style="margin: 28px 0; text-align: left;">
      <a href="${siteUrl}/student" style="background-color: #14263F; color: #FFFFFF; padding: 10px 20px; text-decoration: none; font-size: 13px; font-family: sans-serif; font-weight: 600; border-radius: 2px; display: inline-block;">
        Enter Your Student Portal &rarr;
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

export async function sendVerificationEmail({
  to,
  verificationUrl,
}: {
  to: string;
  verificationUrl: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const subject = "Verify your email — GradEdge Academic Solutions";
  const text = `Please verify your email address to activate your GradEdge researcher account:

${verificationUrl}

If you did not create an account, you can safely ignore this email.
`;

  const bodyHtml = `
    <p style="font-size: 15px; margin-top: 0;">Hello,</p>
    <p style="font-size: 15px;">Please verify your email address to activate your GradEdge researcher account.</p>
    <div style="margin: 28px 0; text-align: left;">
      <a href="${verificationUrl}" style="background-color: #14263F; color: #FFFFFF; padding: 10px 20px; text-decoration: none; font-size: 13px; font-family: sans-serif; font-weight: 600; border-radius: 2px; display: inline-block;">
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
      <a href="${resetUrl}" style="background-color: #14263F; color: #FFFFFF; padding: 10px 20px; text-decoration: none; font-size: 13px; font-family: sans-serif; font-weight: 600; border-radius: 2px; display: inline-block;">
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
