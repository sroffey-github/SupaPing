import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const GENERIC_ERROR = "Couldn't ping this database.";

type Instance = {
  id: string;
  user_id: string;
  project_url: string;
  publishable_key: string | null;
};

type HeartbeatResult = {
  succeeded: boolean;
  latencyMs: number | null;
  errorCode: string | null;
  attemptedAt: string;
};

function validateProjectUrl(value: string): URL | null {
  try {
    const url = new URL(value);

    if (
      url.protocol !== "https:" ||
      !/^[a-z0-9-]+\.supabase\.co$/i.test(url.hostname) ||
      url.port ||
      url.username ||
      url.password
    ) {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

async function saveHeartbeatResult(
  supabase: ReturnType<typeof createAdminClient>,
  instance: Instance,
  result: HeartbeatResult
) {
  const { error: eventError } = await supabase
    .from("heartbeat_events")
    .insert({
      instance_id: instance.id,
      user_id: instance.user_id,
      attempted_at: result.attemptedAt,
      succeeded: result.succeeded,
      latency_ms: result.latencyMs,
      prevented_dormancy: false,
      error_code: result.errorCode,
    });

  if (eventError) {
    console.error("Failed to save cron heartbeat event:", {
      instanceId: instance.id,
      code: eventError.code,
      message: eventError.message,
    });
  }

  const { error: stateError } = await supabase
    .from("heartbeat_state")
    .upsert(
      {
        instance_id: instance.id,
        user_id: instance.user_id,
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
    console.error("Failed to save cron heartbeat state:", {
      instanceId: instance.id,
      code: stateError.code,
      message: stateError.message,
    });
  }

  return !eventError && !stateError;
}

async function pingInstance(
  supabase: ReturnType<typeof createAdminClient>,
  instance: Instance
) {
  const attemptedAt = new Date().toISOString();

  const projectUrl = validateProjectUrl(instance.project_url);

  if (!projectUrl) {
    await saveHeartbeatResult(supabase, instance, {
      succeeded: false,
      latencyMs: null,
      errorCode: "INVALID_TARGET_URL",
      attemptedAt,
    });

    return { succeeded: false, error: "Invalid target URL" };
  }

  if (
    typeof instance.publishable_key !== "string" ||
    !instance.publishable_key.trim()
  ) {
    await saveHeartbeatResult(supabase, instance, {
      succeeded: false,
      latencyMs: null,
      errorCode: "MISSING_PUBLISHABLE_KEY",
      attemptedAt,
    });

    return { succeeded: false, error: "Missing publishable key" };
  }

  const startedAt = Date.now();

  try {
    const response = await fetch(
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

    const latencyMs = Date.now() - startedAt;

    if (!response.ok) {
      // Avoid logging response bodies that could contain sensitive details.
      console.error("Cron target heartbeat failed:", {
        instanceId: instance.id,
        status: response.status,
      });

      const saved = await saveHeartbeatResult(supabase, instance, {
        succeeded: false,
        latencyMs,
        errorCode: `TARGET_HTTP_${response.status}`,
        attemptedAt,
      });

      return {
        succeeded: false,
        persisted: saved,
        error: `Target returned HTTP ${response.status}`,
      };
    }

    const saved = await saveHeartbeatResult(supabase, instance, {
      succeeded: true,
      latencyMs,
      errorCode: null,
      attemptedAt,
    });

    return {
      succeeded: true,
      persisted: saved,
      responseTimeMs: latencyMs,
    };
  } catch (error) {
    const latencyMs = Date.now() - startedAt;

    const errorCode =
      error instanceof Error && error.name === "TimeoutError"
        ? "TARGET_TIMEOUT"
        : "TARGET_UNREACHABLE";

    console.error("Cron target heartbeat request failed:", {
      instanceId: instance.id,
      errorCode,
    });

    const saved = await saveHeartbeatResult(supabase, instance, {
      succeeded: false,
      latencyMs,
      errorCode,
      attemptedAt,
    });

    return {
      succeeded: false,
      persisted: saved,
      error: errorCode,
    };
  }
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.error("CRON_SECRET is not configured.");
    return NextResponse.json(
      { error: "Cron endpoint is not configured." },
      { status: 500 }
    );
  }

  // Vercel Cron sends this bearer token when CRON_SECRET is configured.
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    const { data: instances, error } = await supabase
      .from("database_instances")
      .select("id, user_id, project_url, publishable_key")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to retrieve cron instances:", {
        code: error.code,
        message: error.message,
      });

      return NextResponse.json(
        { error: "Could not retrieve registered databases." },
        { status: 500 }
      );
    }

    let succeeded = 0;
    let failed = 0;
    let persistenceFailures = 0;

    // Deliberately process one target at a time.
    for (const instance of (instances ?? []) as Instance[]) {
      const result = await pingInstance(supabase, instance);

      if (result.succeeded) {
        succeeded++;
      } else {
        failed++;
      }

      if ("persisted" in result && result.persisted === false) {
        persistenceFailures++;
      }

      console.info("Cron heartbeat completed:", {
        instanceId: instance.id,
        succeeded: result.succeeded,
        persisted: "persisted" in result ? result.persisted : undefined,
      });
    }

    return NextResponse.json({
      success: true,
      total: instances?.length ?? 0,
      succeeded,
      failed,
      persistenceFailures,
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "Cron heartbeat job failed:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      { error: GENERIC_ERROR },
      { status: 500 }
    );
  }
}