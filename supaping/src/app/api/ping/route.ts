import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const GENERIC_ERROR = "Couldn't ping this database. Please try again.";

type HeartbeatResult = {
  succeeded: boolean;
  latencyMs: number | null;
  errorCode: string | null;
  attemptedAt: string;
};

async function saveHeartbeatResult(
  supabase: Awaited<ReturnType<typeof createClient>>,
  instanceId: string,
  userId: string,
  result: HeartbeatResult
) {
  const { error: eventError } = await supabase
    .from("heartbeat_events")
    .insert({
      instance_id: instanceId,
      user_id: userId,
      attempted_at: result.attemptedAt,
      succeeded: result.succeeded,
      latency_ms: result.latencyMs,
      prevented_dormancy: false,
      error_code: result.errorCode,
    });

  if (eventError) {
    console.error("Failed to save heartbeat event:", {
      code: eventError.code,
      message: eventError.message,
      details: eventError.details,
      hint: eventError.hint,
    });
  }

  const { error: stateError } = await supabase
    .from("heartbeat_state")
    .upsert(
      {
        instance_id: instanceId,
        user_id: userId,
        last_heartbeat_at: result.succeeded
          ? result.attemptedAt
          : null,
        last_latency_ms: result.latencyMs,
        health_status: result.succeeded ? "healthy" : "failed",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "instance_id" }
    );

  if (stateError) {
    console.error("Failed to save heartbeat state:", {
      code: stateError.code,
      message: stateError.message,
      details: stateError.details,
      hint: stateError.hint,
    });
  }

  return !eventError && !stateError;
}

export async function POST(request: NextRequest) {
  try {
    // Reject cross-origin browser requests.
    const origin = request.headers.get("origin");

    if (origin && origin !== request.nextUrl.origin) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Authenticate the current SupaPing user.
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Rate-limit this authenticated user across all their databases.
    // Fail closed if the limiter cannot be checked.
    const { data: rateLimitData, error: rateLimitError } =
      await supabase.rpc("consume_ping_rate_limit");

    if (rateLimitError || !rateLimitData?.length) {
      console.error("Ping rate limiter failed:", {
        code: rateLimitError?.code,
        message: rateLimitError?.message,
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_UNAVAILABLE",
            message:
              "Pinging is temporarily unavailable. Please try again shortly.",
          },
        },
        { status: 503 }
      );
    }

    const rateLimit = rateLimitData[0];

    if (!rateLimit.allowed) {
      const retryAfter = Math.max(
        1,
        rateLimit.retry_after_seconds
      );

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message:
              "You've reached the ping limit. Please wait before trying again.",
            retryAfterSeconds: retryAfter,
          },
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "Cache-Control": "no-store",
          },
        }
      );
    }

    // Validate the instance ID.
    const body = await request.json().catch(() => null);
    const instanceId = body?.instanceId;

    if (
      typeof instanceId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        instanceId
      )
    ) {
      return NextResponse.json(
        { error: GENERIC_ERROR },
        { status: 400 }
      );
    }

    // Only allow the owner to ping their registered database.
    const { data: instance, error: instanceError } = await supabase
      .from("database_instances")
      .select("id, project_url, publishable_key")
      .eq("id", instanceId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (instanceError || !instance) {
      return NextResponse.json(
        { error: GENERIC_ERROR },
        { status: 404 }
      );
    }

    // Validate the destination to prevent arbitrary outbound requests.
    let projectUrl: URL;

    try {
      projectUrl = new URL(instance.project_url);
    } catch {
      return NextResponse.json(
        { error: GENERIC_ERROR },
        { status: 400 }
      );
    }

    if (
      projectUrl.protocol !== "https:" ||
      !/^[a-z0-9-]+\.supabase\.co$/i.test(projectUrl.hostname) ||
      projectUrl.port ||
      projectUrl.username ||
      projectUrl.password
    ) {
      return NextResponse.json(
        { error: GENERIC_ERROR },
        { status: 400 }
      );
    }

    if (
      typeof instance.publishable_key !== "string" ||
      !instance.publishable_key.trim()
    ) {
      return NextResponse.json(
        { error: GENERIC_ERROR },
        { status: 400 }
      );
    }

    const startedAt = Date.now();
    const attemptedAt = new Date().toISOString();

    let heartbeatResponse: Response;

    try {
      heartbeatResponse = await fetch(
        `${projectUrl.origin}/rest/v1/keep_alive?on_conflict=id`,
        {
          method: "POST",
          headers: {
            apikey: instance.publishable_key,
            "Content-Type": "application/json",
            Prefer: "resolution=merge-duplicates,return=minimal",
          },
          body: JSON.stringify({
            id: 1,
            last_ping_at: attemptedAt,
            ping_token: crypto.randomUUID(),
          }),
          cache: "no-store",
          signal: AbortSignal.timeout(10_000),
        }
      );
    } catch (error) {
      const latencyMs = Date.now() - startedAt;
      const errorCode =
        error instanceof Error && error.name === "TimeoutError"
          ? "TARGET_TIMEOUT"
          : "TARGET_UNREACHABLE";

      const saved = await saveHeartbeatResult(
        supabase,
        instance.id,
        user.id,
        {
          succeeded: false,
          latencyMs,
          errorCode,
          attemptedAt,
        }
      );

      if (!saved) {
        console.error("Heartbeat failure could not be fully persisted.");
      }

      return NextResponse.json(
        { error: GENERIC_ERROR },
        { status: 502 }
      );
    }

    const latencyMs = Date.now() - startedAt;

    if (!heartbeatResponse.ok) {
      const details = await heartbeatResponse.text();

      console.error("SupaPing target heartbeat failed:", {
        status: heartbeatResponse.status,
        details,
      });

      const saved = await saveHeartbeatResult(
        supabase,
        instance.id,
        user.id,
        {
          succeeded: false,
          latencyMs,
          errorCode: `TARGET_HTTP_${heartbeatResponse.status}`,
          attemptedAt,
        }
      );

      if (!saved) {
        console.error("Heartbeat failure could not be fully persisted.");
      }

      return NextResponse.json(
        { error: GENERIC_ERROR },
        { status: 502 }
      );
    }

    // Save the successful ping in SupaPing's own database.
    const saved = await saveHeartbeatResult(
      supabase,
      instance.id,
      user.id,
      {
        succeeded: true,
        latencyMs,
        errorCode: null,
        attemptedAt,
      }
    );

    if (!saved) {
      console.error(
        "Target ping succeeded, but heartbeat history could not be fully saved."
      );

      return NextResponse.json(
        {
          success: true,
          persisted: false,
          responseTimeMs: latencyMs,
          lastPingAt: attemptedAt,
          warning: "Heartbeat succeeded, but its history could not be saved.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      persisted: true,
      responseTimeMs: latencyMs,
      lastPingAt: attemptedAt,
    });
  } catch (error) {
    console.error(
      "SupaPing ping route failed:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      { error: GENERIC_ERROR },
      { status: 502 }
    );
  }
}