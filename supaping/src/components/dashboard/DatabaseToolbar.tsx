"use client";

import { Plus, Search } from "lucide-react";

type DatabaseToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onAddDatabase: () => void;
};

export default function DatabaseToolbar({
  search,
  onSearchChange,
  onAddDatabase,
}: DatabaseToolbarProps) {
  return (
    <section className="w-full">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-[#172B27] sm:text-3xl">
            Your <span className="text-primary-strong">Supabase</span> Databases
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant sm:text-base">
            Quietly pinging connection pools every 10 minutes so your
            free-tier instances never hibernate.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddDatabase}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-2xl border border-emerald-400/40 bg-gradient-to-r from-[#10B981] via-[#00A86B] to-[#009B65] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,168,107,0.22),inset_0_1px_0_rgba(255,255,255,0.35)] transition duration-200 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_10px_24px_rgba(0,168,107,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A86B] active:translate-y-0"
        >
          <Plus size={18} strokeWidth={2.5} />
          Add Database Instance
        </button>
      </div>

      <div className="mt-7">
        <label htmlFor="database-search" className="sr-only">
          Search databases
        </label>

        <div className="flex min-h-[50px] w-full items-center gap-3 rounded-2xl border border-white/80 bg-[#F7F8FA] px-4 shadow-[inset_3px_3px_7px_rgba(166,175,195,0.2),inset_-3px_-3px_7px_rgba(255,255,255,0.95)] transition focus-within:border-[#00A86B]/30 focus-within:ring-2 focus-within:ring-[#00A86B]/10">
          <Search
            size={19}
            className="shrink-0 text-on-surface-variant"
            aria-hidden="true"
          />

          <input
            id="database-search"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by instance name or Supabase project URL..."
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#1E293B] outline-none placeholder:text-text-muted sm:text-[14px]"
          />
        </div>
      </div>
    </section>
  );
}