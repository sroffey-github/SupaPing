import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardContent from "@/components/dashboard/DashboardContent";
import SiteFooter from "@/components/layout/SiteFooter";

export type DatabaseInstance = {
  id: string;
  name: string;
  description: string | null;
  project_url: string;
  created_at: string;
  updated_at: string;
  publishable_key: string | null;
};

export type HeartbeatState = {
  instance_id: string;
  last_heartbeat_at: string | null;
  next_heartbeat_at: string | null;
  last_latency_ms: number | null;
  health_status: "pending" | "healthy" | "degraded" | "failed";
  updated_at: string;
};

export type DashboardStatsData = {
  heartbeatsToday: number;
  averageLatency: number | null;
  hibernationPreventionsToday: number;
};

export type AccountPlan = "free" | "pro";

export type AccountInfo = {
  plan: AccountPlan;
  databaseLimit: number;
};

function getLondonDayBounds() {
  const timeZone = "Europe/London";

  function getLocalDateParts(date: Date) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);

    const values = Object.fromEntries(
      parts.map((part) => [part.type, part.value])
    );

    return {
      year: Number(values.year),
      month: Number(values.month),
      day: Number(values.day),
    };
  }

  function londonMidnightUtc(
    year: number,
    month: number,
    day: number
  ) {
    // Start with a UTC approximation of London midnight.
    const target = Date.UTC(year, month - 1, day);
    let result = target;

    // Resolve the London UTC offset, including daylight-saving time.
    for (let i = 0; i < 3; i++) {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      }).formatToParts(new Date(result));

      const values = Object.fromEntries(
        parts.map((part) => [part.type, part.value])
      );

      const representedAsUtc = Date.UTC(
        Number(values.year),
        Number(values.month) - 1,
        Number(values.day),
        Number(values.hour),
        Number(values.minute),
        Number(values.second)
      );

      result += target - representedAsUtc;
    }

    return new Date(result);
  }

  const now = new Date();
  const today = getLocalDateParts(now);

  const tomorrowDate = new Date(
    Date.UTC(today.year, today.month - 1, today.day + 1)
  );

  const start = londonMidnightUtc(
    today.year,
    today.month,
    today.day
  );

  const end = londonMidnightUtc(
    tomorrowDate.getUTCFullYear(),
    tomorrowDate.getUTCMonth() + 1,
    tomorrowDate.getUTCDate()
  );

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export default async function DashboardPage() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { start, end } = getLondonDayBounds();

  const [
    { data: instances, error: instancesError },
    { data: heartbeatStates, error: heartbeatError },
    { data: heartbeatEvents, error: eventsError },
    { data: profile, error: profileError },
  ] = await Promise.all([
    supabase
      .from("database_instances")
      .select(
        "id, name, description, publishable_key, project_url, created_at, updated_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),

    supabase
      .from("heartbeat_state")
      .select(
        "instance_id, last_heartbeat_at, next_heartbeat_at, last_latency_ms, health_status, updated_at"
      )
      .eq("user_id", user.id),

    supabase
      .from("heartbeat_events")
      .select("succeeded, latency_ms, prevented_dormancy")
      .eq("user_id", user.id)
      .gte("attempted_at", start)
      .lt("attempted_at", end),

    supabase
      .from("user_profiles")
      .select("plan")
      .eq("user_id", user.id)
      .single(),
  ]);

  if (instancesError) {
    console.error(
      "Failed to load database instances:",
      instancesError.code
    );
  }

  if (heartbeatError) {
    console.error(
      "Failed to load heartbeat states:",
      heartbeatError.code
    );
  }

  if (eventsError) {
    console.error(
      "Failed to load heartbeat events:",
      eventsError.code
    );
  }

  if (profileError || !profile) {
    console.error(
      "Failed to load account profile:",
      profileError?.code ?? "PROFILE_MISSING"
    );
  }

  const plan: AccountPlan =
    profile?.plan === "pro" ? "pro" : "free";

  const account: AccountInfo = {
    plan,
    databaseLimit: plan === "pro" ? 100 : 1,
  };

  const events = heartbeatEvents ?? [];
  const successfulEvents = events.filter(
    (event) => event.succeeded
  );

  const latencies = successfulEvents
    .map((event) => event.latency_ms)
    .filter((latency): latency is number => latency !== null);

  const stats: DashboardStatsData = {
    heartbeatsToday: events.length,
    averageLatency:
      latencies.length > 0
        ? Math.round(
            latencies.reduce((total, latency) => total + latency, 0) /
              latencies.length
          )
        : null,
    hibernationPreventionsToday: successfulEvents.filter(
      (event) => event.prevented_dormancy
    ).length,
  };

  return (
    <>
      <DashboardContent
        instances={(instances ?? []) as DatabaseInstance[]}
        heartbeatStates={(heartbeatStates ?? []) as HeartbeatState[]}
        stats={stats}
        account={account}
        loadError={Boolean(instancesError)}
        statsError={Boolean(eventsError)}
      />
      <SiteFooter />
    </>
  );
}