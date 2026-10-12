import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Terminal,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Supabase Guides & Tutorials | SupaPing",
  description:
    "Practical guides to Supabase project pausing, keep-alive methods, scheduled heartbeats, and database activity monitoring.",
  alternates: {
    canonical: "https://www.supaping.app/blog",
  },
  openGraph: {
    title: "Supabase Guides & Tutorials | SupaPing",
    description:
      "Practical guides to Supabase project pausing, keep-alive methods, scheduled heartbeats, and database activity monitoring.",
    url: "https://www.supaping.app/blog",
    siteName: "SupaPing",
    type: "website",
  },
};

const articles = [
  {
    category: "SUPABASE FUNDAMENTALS",
    title: "Why Does Supabase Pause Inactive Projects?",
    description:
      "Understand why Supabase projects can be paused, what inactivity means, and what options are available to keep your project running.",
    href: "/blog/why-does-supabase-pause",
    readTime: "5 min read",
    icon: BookOpen,
    featured: true,
  },
  {
    category: "PRACTICAL GUIDE",
    title: "How to Keep a Supabase Project Active",
    description:
      "Explore practical ways to manage Supabase project activity, including scheduled requests and the limitations of keep-alive techniques.",
    href: "/blog/keep-supabase-project-active",
    readTime: "6 min read",
    icon: ArrowRight,
    featured: false,
  },
  {
    category: "DEVELOPER TUTORIAL",
    title: "Supabase Keep-Alive With Cron Jobs",
    description:
      "Learn how scheduled jobs, REST API requests, and database updates fit together in a keep-alive workflow.",
    href: "/blog/supabase-keep-alive-cron",
    readTime: "8 min read",
    icon: Terminal,
    featured: false,
  },
  {
    category: "METHOD COMPARISON",
    title: "Supabase Keep-Alive Methods Compared",
    description:
      "Compare scheduled jobs, manual activity, and monitoring tools to understand the trade-offs and choose an approach for your project.",
    href: "/blog/supabase-keep-alive-methods",
    readTime: "7 min read",
    icon: Clock3,
    featured: false,
  },
];

export default function BlogPage() {
  const [featured, ...remainingArticles] = articles;

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full border-b backdrop-blur-xl"
        style={{
          background: "rgba(238, 242, 246, 0.88)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.7)",
          boxShadow: "0 4px 20px rgba(166, 175, 195, 0.12)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <img
              src="/logo.webp"
              alt=""
              className="h-9 w-9 object-contain"
            />

            <span className="text-[17px] font-semibold tracking-tight text-[#1d1d1f]">
              Supa<span className="text-primary-strong">Ping</span>
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="flex items-center gap-4 sm:gap-7"
          >
            <Link
              href="/blog"
              aria-current="page"
              className="text-[13px] font-semibold text-primary-strong"
            >
              Blog
            </Link>

            <Link
              href="/"
              className="hidden text-[13px] text-[#475569] transition-colors hover:text-primary-strong sm:inline"
            >
              Home
            </Link>

            <Button
              href="/login"
              size="sm"
              icon={<ArrowRight size={16} />}
            >
              Dashboard
            </Button>
          </nav>
        </div>
      </header>

      <main className="min-h-screen w-full px-6 pb-20 pt-12 sm:pt-16">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-12">
          {/* Page introduction */}
          <section className="flex flex-col gap-5">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-[#E6F8F1] px-3.5 py-2 font-mono text-[11px] font-bold tracking-wide text-primary-strong shadow-sm">
              <BookOpen size={14} />
              THE SUPAPING KNOWLEDGE BASE
            </div>

            <div className="max-w-3xl">
              <h1 className="text-[38px] font-semibold leading-[1.12] tracking-[-0.035em] text-[#0F172A] sm:text-[52px]">
                Better answers for your{" "}
                <span className="text-primary-strong">
                  Supabase projects.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-[16px] leading-[1.8] text-[#475569] sm:text-[17px]">
                Practical, developer-focused guides to project inactivity,
                scheduled heartbeats, keep-alive approaches, and monitoring.
                Understand your options before choosing what works for your
                application.
              </p>
            </div>
          </section>

          {/* Featured article */}
          <section aria-labelledby="featured-heading">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2
                id="featured-heading"
                className="font-mono text-[12px] font-bold uppercase tracking-wider text-primary-strong"
              >
                Start here
              </h2>

              <span className="text-[12px] text-[#64748B]">
                Supabase basics
              </span>
            </div>

            <Link
              href={featured.href}
              className="group block rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-strong"
            >
              <Card
                as="article"
                padding="lg"
                className="relative overflow-hidden gap-6 border border-white/80 p-7 sm:p-10"
                style={{
                  boxShadow:
                    "10px 10px 28px rgba(166, 175, 195, 0.32), -10px -10px 28px rgba(255, 255, 255, 0.95)",
                }}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(0,168,107,0.12), rgba(0,168,107,0) 70%)",
                  }}
                />

                <div className="relative z-10 flex flex-col gap-5">
                  <span className="w-fit rounded-lg bg-[#E6F8F1] px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider text-primary-strong">
                    {featured.category}
                  </span>

                  <h2 className="max-w-2xl text-[27px] font-semibold leading-tight tracking-tight text-[#0F172A] transition-colors group-hover:text-primary-strong sm:text-[36px]">
                    {featured.title}
                  </h2>

                  <p className="max-w-2xl text-[15px] leading-[1.8] text-[#475569] sm:text-[16px]">
                    {featured.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <span className="font-mono text-[11px] text-[#64748B]">
                      {featured.readTime}
                    </span>

                    <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-primary-strong transition-transform group-hover:translate-x-1">
                      Read the guide
                      <ArrowRight size={17} />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          </section>

          {/* Article list */}
          <section aria-labelledby="articles-heading">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  id="articles-heading"
                  className="text-[23px] font-semibold tracking-tight text-[#0F172A]"
                >
                  Explore the guides
                </h2>

                <p className="mt-1 text-[14px] text-[#64748B]">
                  From practical setup to implementation details.
                </p>
              </div>

              <span className="font-mono text-[11px] text-[#64748B]">
                {remainingArticles.length} MORE ARTICLES
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {remainingArticles.map((article) => {
                const Icon = article.icon;

                return (
                  <Link
                    key={article.href}
                    href={article.href}
                    className="group flex rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-strong"
                  >
                    <Card
                      as="article"
                      padding="md"
                      hover
                      className="w-full gap-5 p-6 transition-transform duration-200 group-hover:-translate-y-0.5"
                      style={{
                        boxShadow:
                          "7px 7px 18px rgba(166, 175, 195, 0.28), -7px -7px 18px rgba(255, 255, 255, 0.92)",
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[10px] font-bold tracking-wider text-primary-strong">
                          {article.category}
                        </span>

                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-[#EEF2F6] text-primary-strong shadow-sm">
                          <Icon size={17} />
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col gap-3">
                        <h3 className="text-[20px] font-semibold leading-snug tracking-tight text-[#0F172A] transition-colors group-hover:text-primary-strong">
                          {article.title}
                        </h3>

                        <p className="text-[14px] leading-[1.75] text-[#475569]">
                          {article.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-3 border-t border-slate-300/40 pt-4">
                        <span className="font-mono text-[10px] text-[#64748B]">
                          {article.readTime}
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary-strong">
                          Read article
                          <ArrowRight
                            size={15}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Product CTA */}
          <section>
            <Card
              padding="lg"
              className="flex flex-col items-start justify-between gap-6 p-7 sm:flex-row sm:items-center sm:p-9"
              style={{
                boxShadow:
                  "8px 8px 22px rgba(166, 175, 195, 0.3), -8px -8px 22px rgba(255, 255, 255, 0.95)",
              }}
            >
              <div className="flex max-w-2xl flex-col gap-3">
                <span className="font-mono text-[11px] font-bold tracking-wider text-primary-strong">
                  SUPAPING // HEARTBEAT MONITORING
                </span>

                <h2 className="text-[25px] font-semibold tracking-tight text-[#0F172A]">
                  Want a clearer view of your heartbeat checks?
                </h2>

                <p className="text-[14px] leading-relaxed text-[#475569]">
                  Use SupaPing to send heartbeat requests to your configured
                  Supabase project and review their outcomes and response
                  times from one dashboard.
                </p>
              </div>

              <div className="w-full shrink-0 sm:w-auto">
                <Button
                  href="/login"
                  icon={<ArrowRight size={17} />}
                >
                  Open Dashboard
                </Button>
              </div>
            </Card>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}