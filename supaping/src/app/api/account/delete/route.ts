
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function DELETE(request: NextRequest) {
  // Require a valid authenticated user session.
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "You must be signed in to delete your account." },
      { status: 401 }
    );
  }

  // Require the request to originate from this application.
  const origin = request.headers.get("origin");
  const appOrigin = request.nextUrl.origin;

  if (origin && origin !== appOrigin) {
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 }
    );
  }

  try {
    const admin = createAdminClient();

    // This permanently deletes the Supabase Auth user.
    // Ensure user-owned database records have suitable ON DELETE CASCADE
    // foreign keys before enabling this endpoint in production.
    const { error: deleteError } =
      await admin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error("Account deletion failed:", {
        userId: user.id,
        message: deleteError.message,
      });

      return NextResponse.json(
        { error: "Couldn't delete your account. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Account deletion encountered an error:", {
      userId: user.id,
      message:
        error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      { error: "Couldn't delete your account. Please try again." },
      { status: 500 }
    );
  }
}
