"use client";

import {
  BadgeCheck,
  Heart,
  Gauge,
  Leaf,
} from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  suffix?: string;
  detail: string;
  icon: typeof BadgeCheck;
  iconStyle: string;
  indicator?: "dot" | "bars";
  indicatorText?: string;
  valueDetail?: string;
};

type DashboardStatsProps = {
  registeredInstances: number;
};

function StatCard({
  title,
  value,
  suffix,
  detail,
  icon: Icon,
  iconStyle,
  indicator = "dot",
  indicatorText,
  valueDetail,
}: StatCardProps) {
  return (
    <article className="min-w-0 rounded-[24px] border border-white/80 bg-white p-5 shadow-[0_8px_26px_rgba(148,163,184,0.12)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="min-w-0 text-[13px] font-medium text-[#475569]">
          {title}
        </h2>

        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
        >
          <Icon size={17} strokeWidth={2} />
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-[30px] font-bold leading-none tracking-tight text-[#202124] sm:text-[32px]">
          {value}
        </span>

        {suffix && (
          <span className="text-xs font-medium text-[#64748B]">
            {suffix}
          </span>
        )}

        {valueDetail && (
          <span className="text-xs font-semibold text-[#00865A]">
            {valueDetail}
          </span>
        )}
      </div>

      <div className="mt-4 flex min-w-0 items-center gap-2">
        {indicator === "bars" ? (
          <span
            className="flex h-4 shrink-0 items-end gap-[3px]"
            aria-hidden="true"
          >
            {[10, 14, 11, 15, 12].map((height, index) => (
              <span
                key={index}
                className="w-[5px] rounded-full bg-[#CBD5D1]"
                style={{ height }}
              />
            ))}
          </span>
        ) : (
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-[#CBD5D1]"
            aria-hidden="true"
          />
        )}

        <p className="truncate text-xs text-[#526158]">
          {indicatorText ?? detail}
        </p>
      </div>
    </article>
  );
}

export default function DashboardStats({
  registeredInstances,
}: DashboardStatsProps) {
  return (
    <section
      aria-label="Monitoring statistics"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <StatCard
        title="Registered Databases"
        value={String(registeredInstances)}
        valueDetail="Registered"
        detail="Your connected database projects"
        indicatorText="Total registered to your account"
        icon={BadgeCheck}
        iconStyle="bg-[#C9FBE8] text-[#00794D]"
      />

      <StatCard
        title="Heartbeats Sent Today"
        value="—"
        suffix="pings"
        detail="No heartbeat history available"
        indicatorText="Waiting for monitoring data"
        icon={Heart}
        iconStyle="bg-[#F0EDF0] text-[#303039]"
      />

      <StatCard
        title="Average Edge Latency"
        value="—"
        suffix="ms"
        detail="No latency measurements available"
        indicator="bars"
        indicatorText="Waiting for response-time data"
        icon={Gauge}
        iconStyle="bg-[#F0EDF0] text-[#303039]"
      />

      <StatCard
        title="Hibernate Prevention"
        value="—"
        suffix="saved"
        detail="No successful keep-alives recorded"
        indicatorText="Waiting for heartbeat history"
        icon={Leaf}
        iconStyle="bg-[#C9FBE8] text-[#00794D]"
      />
    </section>
  );
}