"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Send the error to your error-reporting service here if configured.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#EEF2F6] px-5 py-16 text-slate-900">
      <section className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white bg-[#EEF2F6] shadow-[inset_5px_5px_12px_rgba(166,175,195,0.25),inset_-5px_-5px_12px_rgba(255,255,255,0.9)]">
          <span className="font-mono text-2xl font-bold text-amber-600">
            500
          </span>
        </div>

        <p className="mt-8 font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
          Unexpected interruption
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Something went wrong.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600">
          SupaPing hit an unexpected error while loading this page.
          Your next step is simple: try again, or return to safety.
        </p>

        {error.digest && (
          <p className="mt-4 font-mono text-xs text-slate-400">
            Reference: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
          >
            Try again
            <span aria-hidden="true">↻</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-white bg-[#EEF2F6] px-5 py-3 text-sm font-semibold text-slate-700 shadow-[4px_4px_10px_rgba(166,175,195,0.3),-4px_-4px_10px_rgba(255,255,255,0.9)] transition hover:-translate-y-0.5 hover:text-emerald-700"
          >
            Back to homepage
          </Link>
        </div>

        <p className="mt-10 font-mono text-xs text-slate-400">
          ERROR_CODE: INTERNAL_ERROR
        </p>
      </section>
    </main>
  );
}