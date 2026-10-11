import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNextPath(value: string | null): string {
  if (!value) return "/dashboard";

  // Require a local absolute path, not a URL or protocol-relative path.
  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  // Reject backslashes, control characters, and encoded path tricks.
  if (value.includes("\\") || /[\u0000-\u001F\u007F]/.test(value)) {
    return "/dashboard";
  }

  try {
    const parsed = new URL(value, "https://local.invalid");

    if (parsed.origin !== "https://local.invalid") {
      return "/dashboard";
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "/dashboard";
  }
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeNextPath(requestUrl.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(
      new URL("/signup?error=oauth_callback_failed", requestUrl.origin)
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL("/signup?error=oauth_callback_failed", requestUrl.origin)
    );
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}