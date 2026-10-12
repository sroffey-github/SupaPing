
import "server-only";
import { Resend } from "resend";

let resendClient: Resend | undefined;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  resendClient ??= new Resend(apiKey);
  return resendClient;
}

export async function sendFeedbackNotification(input: {
  id: string;
  category: string;
  message: string;
  email: string | null;
  pagePath: string | null;
  userId: string | null;
  createdAt: string;
}) {
  const to = process.env.CRON_ALERT_EMAIL;
  const from = process.env.CRON_FROM_EMAIL;

  if (!to || !from) {
    throw new Error("Feedback email configuration is missing.");
  }

  const resend = getResendClient();

  const { error } = await resend.emails.send({
    from,
    to,
    subject: `SupaPing feedback: ${input.category}`,
    text: [
      "A new feedback submission was received.",
      "",
      `Submission ID: ${input.id}`,
      `Category: ${input.category}`,
      `Submitted: ${input.createdAt}`,
      `User ID: ${input.userId ?? "Anonymous"}`,
      `Reply email: ${input.email ?? "Not provided"}`,
      `Page: ${input.pagePath ?? "Not provided"}`,
      "",
      "Message:",
      input.message,
    ].join("\n"),
    ...(input.email
      ? {
          replyTo: input.email,
        }
      : {}),
  });

  if (error) {
    console.error("Failed to send feedback notification:", {
      name: error.name,
      message: error.message,
    });

    throw new Error("Could not send feedback notification.");
  }
}
