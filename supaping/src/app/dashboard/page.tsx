
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { connection } from "next/server";

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

export default async function DashboardPage() {
  await connection();
  
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    { data: instances, error: instancesError },
    { data: heartbeatStates, error: heartbeatError },
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

  return (
    <DashboardContent
      instances={(instances ?? []) as DatabaseInstance[]}
      heartbeatStates={
        (heartbeatStates ?? []) as HeartbeatState[]
      }
      loadError={Boolean(instancesError)}
    />
  );
}