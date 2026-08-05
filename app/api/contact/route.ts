import { NextRequest, NextResponse } from "next/server";

const contactAttempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function getClientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const attempt = contactAttempts.get(key);

  if (!attempt || attempt.resetAt <= now) {
    contactAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (attempt.count >= MAX_ATTEMPTS) return true;

  attempt.count += 1;
  return false;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const name = String(body?.name || "").trim().slice(0, 120);
  const email = String(body?.email || "").trim().slice(0, 160);
  const phone = String(body?.phone || "").trim().slice(0, 80);
  const topic = String(body?.topic || "").trim().slice(0, 80);
  const message = String(body?.message || "").trim().slice(0, 2000);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram contact form is missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID.");
    return NextResponse.json({ error: "Contact form is not configured yet." }, { status: 503 });
  }

  const text = [
    "<b>New Saba contact message</b>",
    "",
    `<b>Name:</b> ${escapeHtml(name)}`,
    `<b>Email:</b> ${escapeHtml(email)}`,
    phone ? `<b>Phone:</b> ${escapeHtml(phone)}` : "",
    topic ? `<b>Topic:</b> ${escapeHtml(topic)}` : "",
    "",
    `<b>Message:</b>`,
    escapeHtml(message),
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text().catch(() => "");
    console.error("Telegram contact message failed:", error);
    return NextResponse.json({ error: "Could not send message right now." }, { status: 502 });
  }

  return NextResponse.json({ message: "Message sent successfully." });
}
