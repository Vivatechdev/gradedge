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

