type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

const RESEND_API_URL = "https://api.resend.com/emails";

export function isEmailEnabled() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  if (!isEmailEnabled()) {
    console.info("Email skipped because RESEND_API_KEY or EMAIL_FROM is missing.", { to, subject });
    return { skipped: true };
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text: text || stripHtml(html),
    }),
  });

  if (!response.ok) {
    const error = await response.text().catch(() => "Email provider error");
    console.error("Email send failed:", error);
    return { skipped: false, failed: true };
  }

  return { skipped: false, failed: false };
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
