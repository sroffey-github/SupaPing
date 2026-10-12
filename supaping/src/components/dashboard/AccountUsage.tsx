"use client";

import Link from "next/link";

type AccountUsageProps = {
  plan: "free" | "pro";
  registeredInstances: number;
  databaseLimit: number;
};

export default function AccountUsage({
  plan,
  registeredInstances,
  databaseLimit,
}: AccountUsageProps) {
  const isPro = plan === "pro";
  const reachedLimit = registeredInstances >= databaseLimit;
  const usage = Math.min(
    100,
    (registeredInstances / databaseLimit) * 100
  );

  return (
    <section className="rounded-[24px] border border-white/80 bg-white p-5 shadow-[0_8px_26px_rgba(148,163,184,0.12)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-on-surface-variant">
            Your plan
          </p>

          <div className="mt-1 flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#202124]">
              {isPro ? "Pro" : "Free"}
            </h2>

            <span className="rounded-full bg-[#C9FBE8] px-2.5 py-1 text-xs font-semibold text-[#00794D]">
              {isPro ? "Pro tier" : "Free tier"}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-on-surface-variant">
            Registered databases
          </p>
          <p className="mt-1 text-xl font-bold text-[#202124]">
            {registeredInstances}
            <span className="text-sm font-medium text-on-surface-variant">
              {" "}/ {databaseLimit}
            </span>
          </p>
        </div>
      </div>

      <div
        className="mt-5 h-2 overflow-hidden rounded-full bg-[#E8EEEB]"
        role="progressbar"
        aria-label="Database usage"
        aria-valuemin={0}
        aria-valuemax={databaseLimit}
        aria-valuenow={Math.min(registeredInstances, databaseLimit)}
      >
        <div
          className="h-full rounded-full bg-[#008756] transition-[width]"
          style={{ width: `${usage}%` }}
        />
      </div>

      {!isPro && reachedLimit && (
        <div className="mt-5 rounded-2xl bg-[#F0F7F3] p-4">
          <h3 className="font-semibold text-[#202124]">
            Need more databases?
          </h3>
          <p className="mt-1 text-sm leading-6 text-[#526158]">
            You have reached the Free plan limit. Pro supports up
            to 100 registered databases.
          </p>
          <p className="mt-3 text-xs text-[#526158]">
            Pro upgrades are currently managed by the SupaPing team.
            Contact support to request an upgrade.
          </p>
        </div>
      )}
    </section>
  );
}