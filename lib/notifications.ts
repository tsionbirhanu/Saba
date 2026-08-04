import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export type NotificationType =
  | "ACCOUNT_REGISTERED"
  | "ORDER_PLACED"
  | "ORDER_PAID"
  | "ORDER_DELIVERED"
  | "DESIGNER_APPROVED"
  | "DESIGNER_REJECTED"
  | "NEW_MESSAGE"
  | "GENERAL";

type NotifyUserOptions = {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  email?: {
    to: string;
    subject?: string;
    html?: string;
  };
};

export async function notifyUser({ userId, type, title, message, link, email }: NotifyUserOptions) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      body: message,
      message,
      read: false,
      link,
    },
  });

  if (email?.to) {
    await sendEmail({
      to: email.to,
      subject: email.subject || title,
      html: email.html || `<p>${escapeHtml(message)}</p>`,
    });
  }

  return notification;
}

export async function notifyRecentMessage({
  receiverId,
  receiverEmail,
  senderName,
}: {
  receiverId: string;
  receiverEmail?: string | null;
  senderName: string;
}) {
  const recent = await prisma.notification.findFirst({
    where: {
      userId: receiverId,
      type: "NEW_MESSAGE",
      createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
    },
    select: { id: true },
  });

  if (recent) return null;

  return notifyUser({
    userId: receiverId,
    type: "NEW_MESSAGE",
    title: "New message",
    message: `${senderName} sent you a new message. Open your inbox to reply.`,
    link: "/messages",
    email: receiverEmail
      ? {
          to: receiverEmail,
          subject: "You have new Saba messages",
          html: `<p>${escapeHtml(senderName)} sent you a new message on Saba.</p><p>Open your inbox to continue the conversation.</p>`,
        }
      : undefined,
  });
}

export function notificationEmail(title: string, message: string, link?: string) {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
  const action = link ? `<p><a href="${appUrl}${link}">View in Saba</a></p>` : "";
  return `<h2>${escapeHtml(title)}</h2><p>${escapeHtml(message)}</p>${action}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
