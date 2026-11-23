/**
 * GradEdge Branded Email Layout Generator
 * Generates clean, accessible, academic HTML emails with text-only fallbacks.
 * Palettes: Navy (#14263F), Gold (#C8963E), Paper/Cream (#FAF8F4 / #FBF5E9), Ink (#2B2B2B)
 */

export interface EmailLayoutOptions {
  title: string;
  previewText?: string;
  headline?: string;
  bodyHtml: string;
  reason: string;
  isMarketing?: boolean;
  unsubscribeUrl?: string;
  siteUrl?: string;
  customIntro?: string;
}

export function renderBrandedLayout({
  title,
  previewText = "",
  headline,
  bodyHtml,
  reason,
  isMarketing = false,
  unsubscribeUrl,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gradedge.com",
  customIntro,
}: EmailLayoutOptions): { html: string; text: string } {
  const displayHeadline = headline || title;
  const introBlock = customIntro
    ? `<div style="background-color: #FBF5E9; border-left: 3px solid #C8963E; padding: 12px 16px; margin-bottom: 24px; font-size: 14px; color: #14263F; line-height: 1.6; border-radius: 2px;">${escapeHtml(customIntro)}</div>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  ${previewText ? `<div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: #FFFFFF; mso-hide: all;">${escapeHtml(previewText)}</div>` : ""}
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #FAF8F4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2B2B2B; line-height: 1.65; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px; background-color: #FFFFFF; border: 1px solid #E4DFD5; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(20, 38, 63, 0.05);">
          
          <!-- Branded Navy Header -->
          <tr>
            <td style="background-color: #14263F; padding: 24px 32px; border-bottom: 3px solid #C8963E;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: bold; color: #FFFFFF; letter-spacing: -0.01em;">
                      GradEdge
                    </span>
                    <span style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #C8963E; margin-left: 10px; font-weight: 600;">
                      Academic Solutions
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: 600; color: #14263F; margin-top: 0; margin-bottom: 20px; letter-spacing: -0.01em; line-height: 1.35;">
                ${escapeHtml(displayHeadline)}
              </h1>

              ${introBlock}

              <div style="font-size: 15px; color: #2B2B2B; line-height: 1.65;">
                ${bodyHtml}
              </div>

              <!-- Sign-off -->
              <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid #E4DFD5;">
                <p style="margin: 0; font-size: 14px; color: #555555; line-height: 1.6;">
                  With scholarly regard,<br>
                  <strong style="color: #14263F;">The GradEdge Advisory Team</strong><br>
                  <a href="${siteUrl}" style="color: #14263F; text-decoration: underline; font-size: 13px;">gradedge.com</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer with Reason and Opt-Out -->
          <tr>
            <td style="background-color: #FAF8F4; padding: 20px 32px; border-top: 1px solid #E4DFD5; font-size: 12px; color: #666666; line-height: 1.55;">
              <p style="margin: 0 0 8px 0;">
                <strong>Why you received this:</strong> ${escapeHtml(reason)}
              </p>
              <p style="margin: 0 0 8px 0;">
                If you have questions or require academic accommodation, reply directly to this notice or contact <a href="mailto:support@gradedge.com" style="color: #14263F; text-decoration: underline;">support@gradedge.com</a>.
              </p>
              ${
                isMarketing
                  ? `<p style="margin: 8px 0 0 0; padding-top: 8px; border-top: 1px dashed #E4DFD5;">
                      You are receiving this update because you subscribed to academic research briefs.
                      <a href="${unsubscribeUrl || `${siteUrl}/newsletter/unsubscribe`}" style="color: #C8963E; text-decoration: underline; margin-left: 6px;">Unsubscribe</a> or manage preferences in your student account.
                    </p>`
                  : ""
              }
              <p style="margin: 12px 0 0 0; font-size: 11px; color: #888888;">
                GradEdge Academic Solutions &bull; Post-Graduate Advisory and Methodological Consulting &bull; &copy; ${new Date().getFullYear()}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // Generate plain text fallback
  const text = convertHtmlToText(bodyHtml, displayHeadline, customIntro, reason, siteUrl, isMarketing, unsubscribeUrl);

  return { html, text };
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

function convertHtmlToText(
  bodyHtml: string,
  headline: string,
  customIntro: string | undefined,
  reason: string,
  siteUrl: string,
  isMarketing: boolean,
  unsubscribeUrl?: string
): string {
  // Strip tags and normalize paragraphs
  let plain = bodyHtml
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*[\/]?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li>/gi, "  • ")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "$2 ($1)")
    .replace(/<[^>]+>/gi, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();

  let text = `GRADEDGE ACADEMIC SOLUTIONS\n========================================\n\n${headline.toUpperCase()}\n\n`;

  if (customIntro) {
    text += `${customIntro}\n----------------------------------------\n\n`;
  }

  text += `${plain}\n\n`;
  text += `---\nWith scholarly regard,\nThe GradEdge Advisory Team\n${siteUrl}\n\n`;
  text += `========================================\nWhy you received this: ${reason}\nSupport inquiries: support@gradedge.com\n`;

  if (isMarketing) {
    text += `Unsubscribe: ${unsubscribeUrl || `${siteUrl}/newsletter/unsubscribe`}\n`;
  }

  return text;
}

