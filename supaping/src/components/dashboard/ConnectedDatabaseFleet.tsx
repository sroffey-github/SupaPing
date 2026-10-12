"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  Activity,
  Database,
  Pencil,
  Server,
  Globe2,
  Network,
  Trash2,
  Clock3,
  Timer,
  CheckCircle2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type {
  DatabaseInstance,
  HeartbeatState,
} from "@/app/dashboard/page";
import EditDatabaseModal, {
  type EditDatabaseValues,
} from "@/components/dashboard/EditDatabaseModal";
import { deleteDatabase, updateDatabase } from "@/app/dashboard/actions";
import { toast as sonnerToast } from "sonner";

type ConnectedDatabaseFleetProps = {
  instances: DatabaseInstance[];
  heartbeatStates: HeartbeatState[];
  search: string;
  loadError?: boolean;
};

const HOLD_DURATION = 1200;
const CIRCLE_CIRCUMFERENCE = 88;

function getProjectHost(projectUrl: string) {
  try {
    return new URL(projectUrl).hostname;
  } catch {
    return projectUrl;
  }
}

export default function ConnectedDatabaseFleet({
  instances,
  heartbeatStates,
  search,
  loadError = false,
}: ConnectedDatabaseFleetProps) {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [holdingId, setHoldingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [editingInstance, setEditingInstance] =
  useState<DatabaseInstance | null>(null);

  const [pingingId, setPingingId] = useState<string | null>(null);

  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdCompleted = useRef(false);
  const deletingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
    };
  }, []);

  const filteredInstances = instances.filter((instance) => {
    const term = search.trim().toLowerCase();

    if (!term) return true;

    return [
      instance.name,
      instance.description,
      instance.project_url,
    ].some((value) => value?.toLowerCase().includes(term));
  });

  function cancelHold() {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }

    holdCompleted.current = false;
    setHoldingId(null);
  }

  async function performDelete(database: DatabaseInstance) {
    if (deletingRef.current) return;

    deletingRef.current = true;
    holdCompleted.current = true;
    holdTimer.current = null;

    setDeletingId(database.id);
    setMessage("");

    startTransition(async () => {
      try {
        await deleteDatabase(database.id);
        sonnerToast.success("Instance deleted");
        router.refresh();
      } catch (error) {
        sonnerToast.error(
          error instanceof Error
            ? error.message
            : "Couldn't delete instance. Please try again."
        );
      } finally {
        setHoldingId(null);
        setDeletingId(null);
        deletingRef.current = false;
        holdCompleted.current = false;
      }
    });
  }

  async function handleEditDatabase(values: EditDatabaseValues) {
    if (!editingInstance) {
      throw new Error("We couldn't update this database. Please try again.");
    }

    await updateDatabase(editingInstance.id, {
      name: values.name,
      projectUrl: values.projectUrl,
      publishableKey: values.publishableKey,
      description: values.description,
    });

    setEditingInstance(null);
    sonnerToast.success("Instance updated");
    router.refresh();
  }

  function startHold(
    event: React.PointerEvent<HTMLButtonElement>,
    database: DatabaseInstance
  ) {
    if (isPending || deletingRef.current || deletingId) return;
    if (event.button !== 0) return;

    event.preventDefault();

    if (holdTimer.current) clearTimeout(holdTimer.current);

    holdCompleted.current = false;
    setHoldingId(database.id);
    setMessage("");

    holdTimer.current = setTimeout(() => {
      void performDelete(database);
    }, HOLD_DURATION);
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    database: DatabaseInstance
  ) {
    if (event.repeat || (event.key !== " " && event.key !== "Enter")) return;

    event.preventDefault();

    if (isPending || deletingRef.current || deletingId) return;

    if (holdTimer.current) clearTimeout(holdTimer.current);

    holdCompleted.current = false;
    setHoldingId(database.id);

    holdTimer.current = setTimeout(() => {
      void performDelete(database);
    }, HOLD_DURATION);
  }

  function handleKeyUp() {
    if (holdCompleted.current) return;
    cancelHold();
  }

  async function handlePing(database: DatabaseInstance) {
    if (pingingId || isPending || deletingId) return;

    setMessage("");
    setPingingId(database.id);

    try {
      const response = await fetch("/api/ping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instanceId: database.id,
        }),
      });

      const result = await response.json().catch(() => null);

      if (response.status === 429) {
        const retryAfter = Number(
          result?.error?.retryAfterSeconds ??
            response.headers.get("Retry-After") ??
            60
        );

        sonnerToast.error("Ping limit reached", {
          description: `Please wait ${retryAfter} seconds before trying again.`,
        });

        return;
      }

      if (
        response.status === 503 &&
        result?.error?.code === "RATE_LIMIT_UNAVAILABLE"
      ) {
        sonnerToast.error("Pinging temporarily unavailable", {
          description:
            "Rate limiting is temporarily unavailable. Please try again shortly.",
        });

        return;
      }

      if (!response.ok || result?.success !== true) {
        throw new Error("ping_failed");
      }

      router.refresh();

      sonnerToast.success(
        `Heartbeat successful · ${result.responseTimeMs} ms`
      );
    } catch {
      sonnerToast.error(
        "Couldn't ping this database. Please try again."
      );
    } finally {
      setPingingId(null);
    }
  }

  const heartbeatByInstance = new Map(
    heartbeatStates.map((state) => [
      state.instance_id,
      state,
    ])
  );

  return (
    <section className="mt-9 w-full">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-bold tracking-tight text-[#1E293B] sm:text-xl">
            Connected Database Fleet
          </h2>

          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#475569] shadow-sm">
            {instances.length}{" "}
            {instances.length === 1 ? "Instance" : "Instances"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <Activity size={14} className="text-primary-strong" />
          <span>Registered with SupaPing</span>
        </div>
      </div>

      {loadError && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          We couldn't load your database instances. Please refresh the page
          and try again.
        </div>
      )}

      {message && (
        <div
          role="status"
          className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-[#00A86B]/15 bg-white px-4 py-3 text-sm text-[#526158]"
        >
          <span>{message}</span>
          <button
            type="button"
            onClick={() => setMessage("")}
            className="shrink-0 font-medium text-[#00865A] hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {!loadError && filteredInstances.length > 0 && (
        <div className="space-y-3">
          {filteredInstances.map((database) => {
            const host = getProjectHost(database.project_url);
            const isHolding = holdingId === database.id;
            const isDeleting = deletingId === database.id;
            const heartbeat = heartbeatByInstance.get(database.id);
            const isBusy = isPending || Boolean(deletingId) || Boolean(pingingId);

            const lastHeartbeatLabel = heartbeat?.last_heartbeat_at
            ? new Date(heartbeat.last_heartbeat_at).toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: "Europe/London",
              })
            : "Not yet";

            const latencyLabel =
              heartbeat?.last_latency_ms != null
                ? `${heartbeat.last_latency_ms} ms`
                : "No latency data";

            return (
              <article
                key={database.id}
                className="grid min-w-0 grid-cols-1 items-center gap-4 rounded-[22px] border border-white/80 bg-white p-4 shadow-[0_7px_22px_rgba(148,163,184,0.12)] transition-shadow hover:shadow-[0_10px_28px_rgba(148,163,184,0.17)] sm:p-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(230px,0.85fr)_auto]"
              >
                {/* Database identity */}
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#F0EDEF] bg-[#F7F4F6] text-[#00865A]">
                    <Database size={19} strokeWidth={2} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="break-words text-[13px] font-semibold text-[#263238]">
                        {database.name}
                      </h3>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0EFF1] px-2 py-0.5 text-[10px] font-semibold text-[#5E6268]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#9CA3AF]" />
                        Registered
                      </span>
                    </div>

                    {database.description ? (
                      <p className="mt-1 text-xs leading-5 text-[#64716C]">
                        {database.description}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-text-muted">
                        No description provided
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] leading-4 text-[#64716C]">
                      <span className="inline-flex min-w-0 items-center gap-1">
                        <Server size={11} className="shrink-0" />
                        <span className="break-all">{host}</span>
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Globe2 size={11} className="shrink-0" />
                        Supabase project
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Network size={11} className="shrink-0" />
                        HTTPS
                      </span>
                    </div>
                  </div>
                </div>

                {/* Heartbeat panel */}
                <div className="min-w-0 rounded-[16px] bg-[#F7F5F6] px-3 py-3 shadow-[inset_1px_1px_3px_rgba(166,175,195,0.08)] sm:px-4">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 text-[9px] font-medium leading-4 text-[#64716C]">
                      <Clock3 size={10} className="shrink-0" />
                      Last Keep-Alive
                    </p>

                    <p className="mt-0.5 break-words text-[11px] font-semibold text-[#303638]">
                      {lastHeartbeatLabel}
                    </p>

                    <p className="text-[9px] text-text-muted">
                      {latencyLabel}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMessage("");
                      setEditingInstance(database);
                    }}
                    aria-label={`Edit ${database.name}`}
                    title="Edit database"
                    disabled={isBusy}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white bg-white text-[#526158] shadow-[0_3px_9px_rgba(148,163,184,0.18)] transition hover:text-[#00865A] focus-visible:outline-2 focus-visible:outline-[#00A86B] disabled:opacity-50"
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => void handlePing(database)}
                    disabled={isBusy || pingingId !== null}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white bg-white px-3 text-xs font-semibold text-[#334155] shadow-[0_3px_9px_rgba(148,163,184,0.18)] transition hover:-translate-y-0.5 hover:text-[#00865A] focus-visible:outline-2 focus-visible:outline-[#00A86B] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {pingingId === database.id ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#CBD5D1] border-t-[#00865A]" />
                        Pinging…
                      </>
                    ) : (
                      <>
                        <Activity size={14} className="text-[#00865A]" />
                        Ping Now
                      </>
                    )}
                  </button>

                  {/* Hold-to-delete */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isBusy}
                      aria-label={`Hold to delete ${database.name}`}
                      aria-describedby={`delete-hint-${database.id}`}
                      title="Hold to delete"
                      onPointerDown={(event) =>
                        startHold(event, database)
                      }
                      onPointerUp={cancelHold}
                      onPointerLeave={cancelHold}
                      onPointerCancel={cancelHold}
                      onKeyDown={(event) =>
                        handleKeyDown(event, database)
                      }
                      onKeyUp={handleKeyUp}
                      onBlur={cancelHold}
                      className={`relative flex h-10 w-10 shrink-0 touch-none items-center justify-center rounded-xl border border-white bg-white shadow-[0_3px_9px_rgba(148,163,184,0.18)] transition-colors focus-visible:outline-2 focus-visible:outline-red-400 disabled:cursor-not-allowed disabled:opacity-50 ${
                        isHolding || isDeleting
                          ? "text-red-600"
                          : "text-[#64716C] hover:text-red-600"
                      }`}
                    >
                      <svg
                        viewBox="0 0 32 32"
                        className="absolute inset-[3px] h-[34px] w-[34px] -rotate-90"
                        aria-hidden="true"
                      >
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="text-[#E5E7EB]"
                        />

                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          fill="none"
                          stroke="#DC2626"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeDasharray={CIRCLE_CIRCUMFERENCE}
                          strokeDashoffset={
                            isHolding || isDeleting
                              ? 0
                              : CIRCLE_CIRCUMFERENCE
                          }
                          className="transition-[stroke-dashoffset] ease-linear"
                          style={{
                            transitionDuration: isHolding
                              ? `${HOLD_DURATION}ms`
                              : "0ms",
                          }}
                        />
                      </svg>

                      <Trash2
                        size={15}
                        className="relative z-10"
                      />
                    </button>

                    <span
                      id={`delete-hint-${database.id}`}
                      className="max-w-[66px] text-[10px] leading-4 text-text-muted"
                    >
                      {isDeleting
                        ? "Deleting…"
                        : isHolding
                          ? "Keep holding…"
                          : "Hold to delete"}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!loadError && filteredInstances.length === 0 && (
        <div className="rounded-[22px] border border-dashed border-[#CBD5D1] bg-white/60 px-6 py-12 text-center">
          <Database size={25} className="mx-auto text-text-muted" />

          <h3 className="mt-3 text-sm font-semibold text-[#334155]">
            {instances.length === 0
              ? "No database instances yet"
              : "No matching databases"}
          </h3>

          <p className="mt-1 text-sm text-on-surface-variant">
            {instances.length === 0
              ? "Add a database instance to get started."
              : "Try another search term or clear your search."}
          </p>
        </div>
      )}

      <EditDatabaseModal
        open={editingInstance !== null}
        onClose={() => setEditingInstance(null)}
        initialValues={{
          name: editingInstance?.name ?? "",
          projectUrl: editingInstance?.project_url ?? "",
          publishableKey: editingInstance?.publishable_key ?? "",
          description: editingInstance?.description ?? "",
        }}
        onSubmit={handleEditDatabase}
      />
    </section>
  );
}