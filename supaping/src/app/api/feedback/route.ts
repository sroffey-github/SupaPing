
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { sendFeedbackNotification } from "@/lib/email/sendFeedbackNotification";

const categories = ["bug", "feature", "feedback", "support"] as const;
type FeedbackCategory = (typeof categories)[number];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL;

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  // Basic cross-origin protection for browser submissions.
  const origin = request.headers.get("origin");

  if (allowedOrigin && origin) {
    try {
      if (new URL(origin).origin !== new URL(allowedOrigin).origin) {
        return jsonError("Invalid request origin.", 403);
      }
    } catch {
      return jsonError("Invalid request origin.", 403);
    }
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (contentLength > 12_000) {
    return jsonError("Submission is too large.", 413);
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  // Bots often fill hidden fields. Silently accept but do not store.
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ success: true });
  }

  const category = body.category;
  const message =
    typeof body.message === "string" ? body.message.trim() : "";
  const rawEmail =
    typeof body.email === "string" ? body.email.trim() : "";
  const pagePath =
    typeof body.pagePath === "string" ? body.pagePath : null;

  if (
    typeof category !== "string" ||
    !categories.includes(category as FeedbackCategory)
  ) {
    return jsonError("Choose a valid feedback category.", 400);
  }

  if (message.length < 10 || message.length > 3000) {
    return jsonError(
      "Your message must be between 10 and 3,000 characters.",
      400
    );
  }

  if (
    rawEmail.length > 254 ||
    (rawEmail.length > 0 && !emailPattern.test(rawEmail))
  ) {
    return jsonError("Enter a valid email address.", 400);
  }

  const safePagePath =
    pagePath &&
    pagePath.startsWith("/") &&
    !pagePath.startsWith("//") &&
    pagePath.length <= 300
      ? pagePath
      : null;

  // Resolve identity from the authenticated server session, never the body.
  let userId: string | null = null;

  try {
    const sessionClient = await createClient();
    const {
      data: { user },
    } = await sessionClient.auth.getUser();

    userId = user?.id ?? null;
  } catch {
    // Anonymous feedback remains allowed.
  }

  const createdAt = new Date().toISOString();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("feedback")
    .insert({
      user_id: userId,
      category,
      message,
      email: rawEmail || null,
      page_path: safePagePath,
      created_at: createdAt,
    })
    .select("id, created_at")
    .single();

  if (error || !data) {
    console.error("Failed to store feedback:", {
      code: error?.code,
      message: error?.message,
    });

    return jsonError(
      "We couldn't save your feedback. Please try again.",
      500
    );
  }

  // Persist first: an email delivery failure must not lose the submission.
  try {
    await sendFeedbackNotification({
      id: data.id,
      category,
      message,
      email: rawEmail || null,
      pagePath: safePagePath,
      userId,
      createdAt: data.created_at,
    });
  } catch {
    // The submission is safely stored even if email delivery fails.
    // Log the ID so notification failures can be investigated.
    console.error("Feedback notification failed for submission:", data.id);
  }

  return NextResponse.json({ success: true });
}
