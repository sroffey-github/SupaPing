import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#EEF2F6] text-slate-900">
      <main className="flex flex-1 items-center justify-center px-5 py-20">
        <section className="w-full max-w-lg text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white bg-[#EEF2F6] shadow-[8px_8px_20px_rgba(166,175,195,0.35),-8px_-8px_20px_rgba(255,255,255,0.9)]">
            <span className="font-mono text-2xl font-bold text-emerald-700">
              404
            </span>
          </div>

          <p className="mt-8 font-mono text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
            Lost connection
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            This page doesn&apos;t exist.
          </h1>

          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600">
            The page you&apos;re looking for may have moved, been removed,
            or never existed. Let&apos;s get you back on track.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
            >
              Back to homepage
              <span aria-hidden="true">→</span>
            </Link>

            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-xl border border-white bg-[#EEF2F6] px-5 py-3 text-sm font-semibold text-slate-700 shadow-[4px_4px_10px_rgba(166,175,195,0.3),-4px_-4px_10px_rgba(255,255,255,0.9)] transition hover:-translate-y-0.5 hover:text-emerald-700"
            >
              Browse the guides
            </Link>
          </div>

          <p className="mt-10 font-mono text-xs text-slate-400">
            ERROR_CODE: ROUTE_NOT_FOUND
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}