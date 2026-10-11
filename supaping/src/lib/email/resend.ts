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

export async function sendCronAlert(input: {
  subject: string;
  message: string;
}) {
  const to = process.env.CRON_ALERT_EMAIL;
  const from = process.env.CRON_FROM_EMAIL;

  if (!to || !from) {
    throw new Error(
      "CRON_ALERT_EMAIL and CRON_FROM_EMAIL must be configured."
    );
  }

  const resend = getResendClient();

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: input.subject,
    text: input.message,
  });

  if (error) {
    console.error("Failed to send cron alert email:", {
      name: error.name,
      message: error.message,
    });

    throw new Error("Resend could not send the cron alert.");
  }

  return data;
}