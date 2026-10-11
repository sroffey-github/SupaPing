function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-xl bg-[#DDE4EC]/80 ${className}`}
    />
  );
}

function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-white/80 bg-[#EEF2F6] p-5 shadow-[5px_5px_14px_rgba(166,175,195,0.18),-5px_-5px_14px_rgba(255,255,255,0.85)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="w-full space-y-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-3 w-36" />
        </div>
        <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
      </div>
      <Skeleton className="mt-6 h-2 w-full rounded-full" />
    </div>
  );
}

function DatabaseCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/80 bg-[#EEF2F6] p-5 shadow-[5px_5px_14px_rgba(166,175,195,0.18),-5px_-5px_14px_rgba(255,255,255,0.85)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-36 max-w-full" />
            <Skeleton className="h-3 w-48 max-w-full" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
      </div>

      <div className="mt-6 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-32" />
      </div>

      <div className="mt-6 border-t border-slate-200/70 pt-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-9 flex-1 rounded-xl" />
          <Skeleton className="h-9 w-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div
      role="status"
      aria-label="Loading dashboard"
      className="min-h-screen bg-[#EEF2F6] text-[#1E293B]"
    >
      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Page heading and toolbar */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-7 w-48 max-w-full rounded-lg" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Skeleton className="h-11 w-full rounded-xl sm:w-64" />
            <Skeleton className="h-11 w-full rounded-xl sm:w-36" />
          </div>
        </div>

        {/* Dashboard stats */}
        <section
          aria-label="Loading dashboard statistics"
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {Array.from({ length: 4 }, (_, i) => (
            <StatSkeleton key={i} />
          ))}
        </section>

        {/* Connected databases */}
        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-64 max-w-full" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <DatabaseCardSkeleton key={i} />
            ))}
          </div>
        </section>

        <span className="sr-only">Loading your dashboard data…</span>
      </main>
    </div>
  );
}