import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendCronAlert } from "@/lib/email/resend";

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

type PingOutcome = {
  succeeded: boolean;
  persisted: boolean;
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
): Promise<boolean> {
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
): Promise<PingOutcome> {
  const attemptedAt = new Date().toISOString();

  const projectUrl = validateProjectUrl(instance.project_url);

  if (!projectUrl) {
    const persisted = await saveHeartbeatResult(supabase, instance, {
      succeeded: false,
      latencyMs: null,
      errorCode: "INVALID_TARGET_URL",
      attemptedAt,
    });

    return { succeeded: false, persisted };
  }

  if (
    typeof instance.publishable_key !== "string" ||
    !instance.publishable_key.trim()
  ) {
    const persisted = await saveHeartbeatResult(supabase, instance, {
      succeeded: false,
      latencyMs: null,
      errorCode: "MISSING_PUBLISHABLE_KEY",
      attemptedAt,
    });

    return { succeeded: false, persisted };
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

      const persisted = await saveHeartbeatResult(supabase, instance, {
        succeeded: false,
        latencyMs,
        errorCode: `TARGET_HTTP_${response.status}`,
        attemptedAt,
      });

      return { succeeded: false, persisted };
    }

    const persisted = await saveHeartbeatResult(supabase, instance, {
      succeeded: true,
      latencyMs,
      errorCode: null,
      attemptedAt,
    });

    return { succeeded: true, persisted };
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

    const persisted = await saveHeartbeatResult(supabase, instance, {
      succeeded: false,
      latencyMs,
      errorCode,
      attemptedAt,
    });

    return { succeeded: false, persisted };
  }
}

type RunStatus = "succeeded" | "partial_failure" | "failed";

async function finishCronRun(
  supabase: ReturnType<typeof createAdminClient>,
  runId: string,
  values: {
    status: RunStatus;
    total: number;
    succeeded: number;
    failed: number;
    persistenceFailures: number;
    startedAtMs: number;
    errorCode?: string | null;
  }
): Promise<boolean> {
  const completedAt = new Date().toISOString();

  const { error } = await supabase
    .from("cron_runs")
    .update({
      completed_at: completedAt,
      status: values.status,
      total_instances: values.total,
      succeeded: values.succeeded,
      failed: values.failed,
      persistence_failures: values.persistenceFailures,
      error_code: values.errorCode ?? null,
      duration_ms: Math.max(0, Date.now() - values.startedAtMs),
    })
    .eq("id", runId);

  if (error) {
    console.error("Failed to finalize cron run:", {
      runId,
      code: error.code,
      message: error.message,
    });

    return false;
  }

  return true;
}

async function sendAndRecordCronAlert(
  supabase: ReturnType<typeof createAdminClient>,
  runId: string,
  subject: string,
  message: string
): Promise<boolean> {
  try {
    await sendCronAlert({ subject, message });

    const { error } = await supabase
      .from("cron_runs")
      .update({ alerts_sent: 1 })
      .eq("id", runId);

    if (error) {
      console.error("Failed to record cron alert:", {
        runId,
        code: error.code,
        message: error.message,
      });
    }

    return true;
  } catch (error) {
    console.error("Failed to send cron alert:", {
      runId,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return false;
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

  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAtMs = Date.now();
  const startedAt = new Date(startedAtMs).toISOString();

  let supabase: ReturnType<typeof createAdminClient>;

  try {
    supabase = createAdminClient();
  } catch (error) {
    console.error(
      "Failed to initialize cron database client:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      { error: "Could not initialize cron execution." },
      { status: 500 }
    );
  }

  // Create the run record before processing any instances.
  const { data: run, error: runInsertError } = await supabase
    .from("cron_runs")
    .insert({
      started_at: startedAt,
      status: "running",
    })
    .select("id")
    .single();

  if (runInsertError || !run) {
    console.error("Failed to create cron run record:", {
      code: runInsertError?.code,
      message: runInsertError?.message,
    });

    return NextResponse.json(
      { error: "Could not record cron execution." },
      { status: 500 }
    );
  }

  const runId: string = run.id;

  let total = 0;
  let succeeded = 0;
  let failed = 0;
  let persistenceFailures = 0;

  try {
    const { data: instances, error } = await supabase
      .from("database_instances")
      .select("id, user_id, project_url, publishable_key")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to retrieve cron instances:", {
        runId,
        code: error.code,
        message: error.message,
      });

      await finishCronRun(supabase, runId, {
        status: "failed",
        total,
        succeeded,
        failed,
        persistenceFailures,
        startedAtMs,
        errorCode: "INSTANCE_QUERY_FAILED",
      });

      await sendAndRecordCronAlert(
        supabase,
        runId,
        "SupaPing critical alert: unable to retrieve databases",
        [
          "SupaPing could not retrieve the registered databases.",
          "",
          `Run ID: ${runId}`,
          "Error code: INSTANCE_QUERY_FAILED",
          `Details: ${error.message}`,
          `Time: ${new Date().toISOString()}`,
        ].join("\n")
      );

      return NextResponse.json(
        { error: "Could not retrieve registered databases.", runId },
        { status: 500 }
      );
    }

    const targets = (instances ?? []) as Instance[];
    total = targets.length;

    // Deliberately process one target at a time.
    for (const instance of targets) {
      const result = await pingInstance(supabase, instance);

      if (result.succeeded) {
        succeeded++;
      } else {
        failed++;
      }

      if (!result.persisted) {
        persistenceFailures++;
      }

      console.info("Cron heartbeat completed:", {
        runId,
        instanceId: instance.id,
        succeeded: result.succeeded,
        persisted: result.persisted,
      });
    }

    const status: RunStatus =
      failed > 0 || persistenceFailures > 0
        ? "partial_failure"
        : "succeeded";

    
    const finalized = await finishCronRun(supabase, runId, {
      status,
      total,
      succeeded,
      failed,
      persistenceFailures,
      startedAtMs,
    });

    if (!finalized) {
      return NextResponse.json(
        { error: "Could not finalize cron execution.", runId },
        { status: 500 }
      );
    }

    if (status === "partial_failure") {
      await sendAndRecordCronAlert(
        supabase,
        runId,
        `SupaPing alert: ${failed} heartbeat failure(s)`,
        [
          "A SupaPing cron run completed with errors.",
          "",
          `Run ID: ${runId}`,
          `Status: ${status}`,
          `Total databases: ${total}`,
          `Successful heartbeats: ${succeeded}`,
          `Failed heartbeats: ${failed}`,
          `Persistence failures: ${persistenceFailures}`,
          `Duration: ${Date.now() - startedAtMs} ms`,
          `Completed at: ${new Date().toISOString()}`,
        ].join("\n")
      );
    }

    return NextResponse.json({
      success: true,
      runId,
      status,
      total,
      succeeded,
      failed,
      persistenceFailures,
      durationMs: Date.now() - startedAtMs,
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron heartbeat job failed:", {
      runId,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    // Preserve whatever totals were collected before the unexpected error.
    await finishCronRun(supabase, runId, {
      status: "failed",
      total,
      succeeded,
      failed,
      persistenceFailures,
      startedAtMs,
      errorCode: "CRON_EXECUTION_FAILED",
    });

    
    await sendAndRecordCronAlert(
      supabase,
      runId,
      "SupaPing critical alert: cron execution failed",
      [
        "The SupaPing cron execution failed unexpectedly.",
        "",
        `Run ID: ${runId}`,
        "Error code: CRON_EXECUTION_FAILED",
        `Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        `Databases processed: ${total}`,
        `Successful heartbeats: ${succeeded}`,
        `Failed heartbeats: ${failed}`,
        `Persistence failures: ${persistenceFailures}`,
        `Time: ${new Date().toISOString()}`,
      ].join("\n")
    );

    return NextResponse.json(
      {
        error: GENERIC_ERROR,
        runId,
        total,
        succeeded,
        failed,
        persistenceFailures,
      },
      { status: 500 }
    );
  }
}