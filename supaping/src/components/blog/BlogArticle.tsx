
import type { ReactNode } from "react";
import Link from "next/link";

import SiteFooter from "@/components/layout/SiteFooter";

type BlogArticleProps = {
  category: string;
  title: string;
  description: string;
  publishedLabel: string;
  readTime: string;
  children: ReactNode;
};

const relatedArticles = [
  {
    title: "Why Does Supabase Pause?",
    href: "/blog/why-does-supabase-pause",
  },
  {
    title: "Keep a Supabase Project Active",
    href: "/blog/keep-supabase-project-active",
  },
  {
    title: "Supabase Keep-Alive Cron Jobs",
    href: "/blog/supabase-keep-alive-cron",
  },
  {
    title: "Compare Supabase Keep-Alive Methods",
    href: "/blog/supabase-keep-alive-methods",
  },
];

export default function BlogArticle({
  category,
  title,
  description,
  publishedLabel,
  readTime,
  children,
}: BlogArticleProps) {
  return (
    <main className="min-h-screen bg-[#EEF2F6] text-slate-900">
      <header className="border-b border-slate-200/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              S
            </span>
            <span className="text-lg">SupaPing</span>
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-white bg-[#EEF2F6] px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-[4px_4px_10px_rgba(166,175,195,0.3),-4px_-4px_10px_rgba(255,255,255,0.9)] transition hover:-translate-y-0.5"
          >
            Visit SupaPing <span aria-hidden="true">→</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,760px)_240px] lg:gap-16">
        <article className="min-w-0">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-500">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-emerald-700">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="hover:text-emerald-700">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-700">{category}</li>
            </ol>
          </nav>

          <header className="mb-10">
            <p className="mb-4 inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">
              {category}
            </p>

            <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl">
              {title}
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              {description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500">
              <span>{publishedLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{readTime}</span>
              <span aria-hidden="true">·</span>
              <span>By SupaPing</span>
            </div>
          </header>

          <div className="mb-10 rounded-2xl border border-white bg-white/80 p-5 shadow-[6px_6px_18px_rgba(148,163,184,0.12)] sm:p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
              In this guide
            </p>
            <p className="leading-7 text-slate-600">
              Practical guidance for developers building and maintaining
              projects on Supabase's Free Plan.
            </p>
          </div>

          <div className="blog-content">{children}</div>

          <section className="mt-14 rounded-3xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-7 sm:p-9">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
              Less manual maintenance
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Keep your Supabase project on your radar.
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              SupaPing runs scheduled keep-alive requests that update a
              dedicated table in your Supabase project. See how it fits your
              setup and review the approach before relying on it.
            </p>
            <Link
              href="/"
              className="btn-primary mt-6 rounded-xl px-5 py-3 text-sm"
            >
              Explore SupaPing <span aria-hidden="true">→</span>
            </Link>
          </section>

          <footer className="mt-10 border-t border-slate-200 pt-6">
            <p className="text-sm leading-6 text-slate-500">
              Technical behaviour and platform policies can change. Consult
              the official Supabase documentation linked in this article
              before making decisions about your production projects.
            </p>
          </footer>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">More Supabase guides</h2>
            <ul className="mt-4 space-y-3">
              {relatedArticles.map((article) => (
                <li key={article.href}>
                  <Link
                    href={article.href}
                    className="text-sm font-medium leading-6 text-slate-600 transition hover:text-emerald-700"
                  >
                    {article.title} <span aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white bg-[#EEF2F6] p-5 shadow-[inset_4px_4px_10px_rgba(166,175,195,0.22),inset_-4px_-4px_10px_rgba(255,255,255,0.85)]">
            <h2 className="font-bold text-slate-900">Primary reference</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Always check Supabase's current platform documentation for
              the latest plan limits and inactivity behaviour.
            </p>
            <a
              href="https://supabase.com/docs/guides/platform/free-project-pausing"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-sm font-semibold text-emerald-800 underline decoration-emerald-300 underline-offset-4"
            >
              Supabase documentation
            </a>
          </div>
        </aside>
      </div>

      <SiteFooter />
    </main>
  );
}
