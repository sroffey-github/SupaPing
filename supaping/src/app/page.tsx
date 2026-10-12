"use client";

import {
  ArrowRight,
  Bolt,
  Check,
  CirclePlay,
  Database,
} from "lucide-react";

import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import InsetPanel from "@/components/ui/InsetPanel";
import StatusPill from "@/components/ui/StatusPill";
import StatusDot from "@/components/ui/StatusDot";
import SiteFooter from "@/components/layout/SiteFooter";

const stats = [
  {
    value: "On-demand",
    label: "Heartbeat checks",
    color: "text-[#0F172A]",
  },
  {
    value: "REST API",
    label: "Supabase connection",
    color: "text-[#008756]",
  },
  {
    value: "Built-in",
    label: "Heartbeat history",
    color: "text-[#d97706]",
  },
];

const steps = [
  {
    number: "01",
    tag: "QUICK SETUP",
    title: "Connect your project",
    description:
      "Add your Supabase project URL and publishable key. SupaPing uses these to send heartbeat requests to your project's REST API.",
    detail: "https://your-project.supabase.co",
    note: "Project credentials configured",
    kind: "success",
  },
  {
    number: "02",
    tag: "HEARTBEAT REQUEST",
    title: "Send a ping",
    description:
      "Trigger a heartbeat to update your project's keep-alive record. SupaPing measures the response time and records whether the request succeeded.",
    detail: "POST /rest/v1/keep_alive",
    note: "Response time and result recorded",
    kind: "query",
  },
  {
    number: "03",
    tag: "HEALTH HISTORY",
    title: "See what happened",
    description:
      "Review heartbeat attempts, response times and health status in your dashboard. When a request fails, you can investigate the recorded result.",
    detail: "Heartbeat history",
    note: "Results available in your dashboard",
    kind: "success",
  },
];

const principles = [
  {
    title: "Focused on One Job",
    description:
      "SupaPing focuses on Supabase keep-alive heartbeats instead of trying to be a full application performance monitoring platform.",
  },
  {
    title: "Straightforward Setup",
    description:
      "Connect a Supabase project using its project URL and publishable key, then use the dashboard to trigger and inspect heartbeat requests.",
  },
  {
    title: "Useful Request History",
    description:
      "See recorded outcomes, response times and health status rather than relying on a green indicator with no supporting information.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    description: "Everything you need to keep a project active.",
    price: "£0",
    period: "forever",
    databaseLimit: "1 database",
    features: [
      "1 registered Supabase database",
      "Automated heartbeat requests",
      "Heartbeat history and results",
      "Response time measurements",
      "Database health status",
    ],
    cta: "Get Started",
    href: "/login",
    highlighted: false,
  },
  {
    name: "Pro",
    description: "For developers managing multiple Supabase projects.",
    price: "Coming soon",
    period: "pricing announced later",
    databaseLimit: "Up to 100 databases",
    features: [
      "Everything in Free",
      "Up to 100 registered databases",
      "Manage multiple projects in one dashboard",
      "Centralised heartbeat monitoring",
      "Ideal for larger project collections",
    ],
    cta: "Request Pro Access",
    href: "mailto:support@supaping.app?subject=SupaPing%20Pro%20Access",
    highlighted: true,
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[12px] font-bold uppercase tracking-wider text-[#008756]">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <header
        className="fixed top-0 z-50 w-full border-b backdrop-blur-xl"
        style={{
          background: "rgba(238, 242, 246, 0.88)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.7)",
          boxShadow: "0 4px 20px rgba(166, 175, 195, 0.15)",
        }}
      >
        <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2.5">
            <img
              src="/logo.webp"
              alt=""
              className="h-10 w-10 shrink-0 object-contain"
            />

            <span className="text-[17px] font-semibold tracking-tight text-[#1d1d1f]">
              Supa<span className="text-[#00A86B]">Ping</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-[13px] text-[#6e6e73] sm:flex">
            <a href="#overview" className="font-medium text-[#1d1d1f]">
              Overview
            </a>
            <a
              href="#how-it-works"
              className="transition-colors hover:text-[#1d1d1f]"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="transition-colors hover:text-[#1d1d1f]"
            >
              Pricing
            </a>
            <a
              href="#philosophy"
              className="transition-colors hover:text-[#1d1d1f]"
            >
              Why SupaPing
            </a>
          </nav>

          <Button href="/login" size="sm" icon={<ArrowRight size={18} />}>
            Open Dashboard
          </Button>
        </div>
      </header>

      <main id="overview" className="min-h-screen w-full pt-14">
        {/* Hero */}
        <section className="relative w-full overflow-hidden px-6 py-20">
          <div className="relative z-10 mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-6">
              <StatusPill
                label="Supabase Keep-Alive"
                secondaryLabel="Heartbeat Monitoring"
              />

              <div className="flex flex-col gap-3">
                <h1 className="text-[46px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#0F172A] sm:text-[56px]">
                  Your database.
                  <br />
                  <span className="text-[#008756]">Keep it active.</span>
                </h1>

                <p className="max-w-lg text-[17px] leading-[1.6] text-[#334155]">
                  Send lightweight heartbeat requests to your Supabase
                  project, measure response times, and keep track of
                  successful and failed checks from one simple dashboard.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button href="/login" icon={<ArrowRight size={18} />}>
                  Get Started
                </Button>

                <Button
                  href="#how-it-works"
                  variant="secondary"
                  size="md"
                  icon={<CirclePlay size={20} className="text-[#008756]" />}
                  iconPosition="left"
                >
                  See How It Works
                </Button>
              </div>

              {/* Product capabilities */}
              <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </div>
            </div>

            {/* Illustrative heartbeat panel */}
            <div className="w-full lg:col-span-6">
              <Card padding="md" className="w-full gap-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                    <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                    <span className="h-3 w-3 rounded-full bg-[#27c93f]" />

                    <span className="ml-2 font-mono text-[12px] font-medium text-[#475569]">
                      supaping / heartbeat
                    </span>
                  </div>

                  <span className="rounded-full bg-[#E6F8F1] px-3 py-1 font-mono text-[11px] font-semibold text-[#006e46]">
                    REQUEST FLOW
                  </span>
                </div>

                <InsetPanel
                  className="relative flex h-72 w-full flex-col items-center justify-center overflow-hidden rounded-2xl"
                  style={{
                    boxShadow:
                      "inset 4px 4px 10px rgba(166, 175, 195, 0.25), inset -4px -4px 10px rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.8)",
                  }}
                >
                  {/* Decorative illustration, not live telemetry */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="absolute h-36 w-36 rounded-full border border-primary/20 bg-primary/10" />
                    <div className="absolute h-56 w-56 rounded-full border border-primary/10 bg-primary/[0.05]" />
                    <div className="absolute h-72 w-72 rounded-full border border-dashed border-[#CBD5E1] opacity-70" />
                  </div>

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative flex w-28 flex-col items-center">
                      <div
                        className="relative flex h-7 w-24 items-center justify-center rounded-[50%]"
                        style={{
                          background: "#EEF2F6",
                          boxShadow:
                            "4px 4px 10px rgba(166, 175, 195, 0.35), -4px -4px 8px rgba(255, 255, 255, 0.9), inset 1px 1px 2px rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        <span className="h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_rgba(0,168,107,0.5)]" />
                      </div>

                      {["#E2E8F0", "#CBD5E1", "#94A3B8"].map((color) => (
                        <div
                          key={color}
                          className="-mt-3.5 h-6 w-24 rounded-[50%] border"
                          style={{
                            background: color,
                            borderColor: color,
                          }}
                        />
                      ))}
                    </div>

                    <div className="mt-4 flex flex-col items-center gap-2">
                      <span className="font-mono text-[13px] font-bold tracking-wide text-[#0F172A]">
                        SUPABASE // PROJECT
                      </span>

                      <div
                        className="flex items-center gap-2 rounded-full px-3.5 py-1.5"
                        style={{
                          background: "#E6F8F1",
                          boxShadow:
                            "inset 1px 1px 3px rgba(0, 168, 107, 0.2), 2px 2px 6px rgba(166, 175, 195, 0.2)",
                          border: "1px solid #A7F3D0",
                        }}
                      >
                        <StatusDot />
                        <span className="font-mono text-[12px] font-semibold text-[#006e46]">
                          HEARTBEAT REQUEST
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="absolute right-3 top-3 flex min-w-[130px] flex-col gap-0.5 rounded-xl p-2.5"
                    style={{
                      background: "#EEF2F6",
                      boxShadow:
                        "3px 3px 8px rgba(166, 175, 195, 0.35), -3px -3px 8px rgba(255, 255, 255, 0.95)",
                      border: "1px solid rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    <span className="font-mono text-[10px] font-bold tracking-wider text-[#64748B]">
                      REQUEST METHOD
                    </span>

                    <span className="font-mono text-[12px] font-bold text-primary">
                      POST / REST
                    </span>
                  </div>

                  <div
                    className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl px-3 py-1.5 font-mono text-[12px] text-[#334155]"
                    style={{
                      background: "#EEF2F6",
                      boxShadow:
                        "3px 3px 8px rgba(166, 175, 195, 0.35), -3px -3px 8px rgba(255, 255, 255, 0.95)",
                      border: "1px solid rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    <Database size={15} className="text-[#d97706]" />
                    <span className="font-medium">Supabase REST API</span>
                  </div>
                </InsetPanel>

                <p className="text-center text-[11px] text-[#64748B]">
                  Illustrative request flow — not live database telemetry.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="relative w-full px-6 py-24"
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.8)",
            borderBottom: "1px solid rgba(166, 175, 195, 0.2)",
          }}
        >
          <div className="mx-auto flex max-w-[1280px] flex-col gap-12">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className="flex flex-col gap-2">
                <SectionLabel>// HOW IT WORKS</SectionLabel>

                <h2 className="text-[34px] font-semibold tracking-tight text-[#0F172A]">
                  Keep your heartbeat checks simple
                </h2>
              </div>

              <p className="max-w-md text-[16px] leading-relaxed text-[#334155]">
                Connect your project, send heartbeat requests, and inspect
                their results. SupaPing gives you a straightforward way to
                track the requests made to your Supabase project.
              </p>
            </div>

            {/* Setup and request steps */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <Card
                  key={step.number}
                  as="article"
                  padding="lg"
                  hover
                  className="justify-between gap-6"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[26px] font-bold text-[#008756]">
                        {step.number}
                      </span>

                      <span
                        className="rounded-xl px-3 py-1 font-mono text-[11px] font-semibold text-[#475569]"
                        style={{
                          background: "#EEF2F6",
                          boxShadow:
                            "inset 2px 2px 4px rgba(166, 175, 195, 0.3), inset -2px -2px 4px rgba(255, 255, 255, 0.8)",
                        }}
                      >
                        {step.tag}
                      </span>
                    </div>

                    <h3 className="text-[20px] font-semibold tracking-tight text-[#0F172A]">
                      {step.title}
                    </h3>

                    <p className="text-[15px] leading-relaxed text-[#334155]">
                      {step.description}
                    </p>
                  </div>

                  <InsetPanel className="flex flex-col gap-1.5 rounded-2xl p-4 font-mono text-[12px]">
                    <span
                      className={
                        step.kind === "query"
                          ? "font-bold text-[#d97706]"
                          : "truncate font-medium text-[#475569]"
                      }
                    >
                      {step.detail}
                    </span>

                    <span className="font-semibold text-[#008756]">
                      {step.kind === "success" && step.number === "03" ? (
                        <>
                          <Bolt className="mr-1 inline" size={16} />
                          {step.note}
                        </>
                      ) : (
                        step.note
                      )}
                    </span>
                  </InsetPanel>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section
          id="philosophy"
          className="relative w-full px-6 py-24"
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.8)",
            borderBottom: "1px solid rgba(166, 175, 195, 0.2)",
          }}
        >
          <div className="mx-auto flex max-w-[1280px] flex-col gap-12">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-2 text-center">
              <SectionLabel>// OUR APPROACH</SectionLabel>

              <h2 className="text-[34px] font-semibold tracking-tight text-[#0F172A]">
                One job. Done well.
              </h2>

              <p className="text-[16px] leading-relaxed text-[#334155]">
                You don't need an oversized monitoring suite just to send a
                heartbeat request. SupaPing focuses on project setup,
                heartbeat checks, and useful records of what happened.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {principles.map((item) => (
                <Card
                  key={item.title}
                  as="article"
                  padding="md"
                  hover
                  className="gap-4 p-7"
                  style={{
                    boxShadow:
                      "8px 8px 20px rgba(166, 175, 195, 0.35), -8px -8px 20px rgba(255, 255, 255, 0.95), inset 2px 2px 3px rgba(255, 255, 255, 0.7)",
                  }}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-100 text-red-600">
                    <span className="text-base font-bold">×</span>
                  </div>

                  <h3 className="text-[18px] font-semibold tracking-tight text-[#0F172A]">
                    {item.title}
                  </h3>

                  <p className="text-[14px] leading-normal text-[#334155]">
                    {item.description}
                  </p>
                </Card>
              ))}

              <Card
                as="article"
                padding="md"
                hover
                className="gap-4 border-emerald-600/30 p-7"
                style={{
                  boxShadow:
                    "8px 8px 20px rgba(166, 175, 195, 0.35), -8px -8px 20px rgba(255, 255, 255, 0.95), inset 2px 2px 3px rgba(255, 255, 255, 0.7)",
                }}
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
                  style={{
                    background: "linear-gradient(145deg, #00b372, #008f5a)",
                  }}
                >
                  <Check size={18} />
                </div>

                <h3 className="text-[18px] font-semibold tracking-tight text-[#006e46]">
                  Clear Results
                </h3>

                <p className="text-[14px] font-medium leading-normal text-[#0F172A]">
                  Review request outcomes, response times, and health status
                  without unnecessary monitoring complexity.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section
          id="pricing"
          className="relative w-full px-6 py-24"
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.8)",
            borderBottom: "1px solid rgba(166, 175, 195, 0.2)",
          }}
        >
          <div className="mx-auto flex max-w-[1100px] flex-col gap-12">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
              <SectionLabel>// SIMPLE PRICING</SectionLabel>

              <h2 className="text-[34px] font-semibold tracking-tight text-[#0F172A] sm:text-[40px]">
                Start free. Scale when you need to.
              </h2>

              <p className="text-[16px] leading-relaxed text-[#334155]">
                Start with one Supabase project for free. When you need to
                monitor more projects, Pro will give you room to grow.
              </p>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
              {pricingPlans.map((plan) => (
                <Card
                  key={plan.name}
                  as="article"
                  padding="lg"
                  className={`relative gap-7 p-7 sm:p-9 ${
                    plan.highlighted
                      ? "border border-[#008756]/30"
                      : ""
                  }`}
                  style={{
                    boxShadow: plan.highlighted
                      ? "10px 10px 26px rgba(0, 135, 86, 0.10), -8px -8px 24px rgba(255, 255, 255, 0.95)"
                      : "8px 8px 20px rgba(166, 175, 195, 0.30), -8px -8px 20px rgba(255, 255, 255, 0.95)",
                  }}
                >
                  {plan.highlighted && (
                    <span className="absolute right-6 top-6 rounded-full bg-[#DDF8EB] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#00794D]">
                      For growing projects
                    </span>
                  )}

                  <div className="flex flex-col gap-3 pr-4">
                    <h3 className="text-[22px] font-semibold tracking-tight text-[#0F172A]">
                      {plan.name}
                    </h3>

                    <p className="min-h-12 max-w-sm text-[14px] leading-relaxed text-[#475569]">
                      {plan.description}
                    </p>

                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 pt-2">
                      <span className="text-[38px] font-bold tracking-tight text-[#0F172A]">
                        {plan.price}
                      </span>
                      <span className="text-[12px] text-[#64748B]">
                        {plan.period}
                      </span>
                    </div>

                    <div className="mt-1 inline-flex w-fit items-center gap-2 rounded-xl bg-[#E6F8F1] px-3 py-2 text-[13px] font-semibold text-[#006e46]">
                      <Database size={16} />
                      {plan.databaseLimit}
                    </div>
                  </div>

                  <div className="h-px w-full bg-slate-300/50" />

                  <ul className="flex flex-1 flex-col gap-4">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-[14px] leading-relaxed text-[#334155]"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DDF8EB] text-[#008756]">
                          <Check size={13} strokeWidth={2.5} />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    href={plan.href}
                    variant={plan.highlighted ? "primary" : "secondary"}
                    size="lg"
                    icon={<ArrowRight size={18} />}
                  >
                    {plan.cta}
                  </Button>

                  {plan.highlighted && (
                    <p className="text-center text-[11px] leading-relaxed text-[#64748B]">
                      Pro access is currently managed manually. Pricing
                      and availability will be announced later.
                    </p>
                  )}
                </Card>
              ))}
            </div>

            <p className="text-center text-[12px] text-[#64748B]">
              No payment details required to get started with Free.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full px-6 py-20">
          <Card
            padding="lg"
            className="relative mx-auto w-full max-w-[1280px] items-center justify-between gap-8 overflow-hidden p-8 sm:p-14 md:flex-row"
            style={{
              boxShadow:
                "14px 14px 32px rgba(166, 175, 195, 0.45), -14px -14px 32px rgba(255, 255, 255, 0.95), inset 2px 2px 4px rgba(255, 255, 255, 0.7)",
            }}
          >
            <div className="z-10 flex max-w-xl flex-col gap-3">
              <div className="inline-flex items-center gap-2 font-mono text-[12px] font-bold uppercase text-[#008756]">
                <StatusDot />
                SUPABASE HEARTBEAT CHECKS
              </div>

              <h2 className="text-[34px] font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-[40px]">
                Ready to get started?
              </h2>

              <p className="text-[16px] leading-normal text-[#334155]">
                Connect your Supabase project and start managing heartbeat
                requests and their results from one dashboard.
              </p>
            </div>

            <div className="z-10 w-full md:w-auto">
              <Button href="/login" icon={<ArrowRight size={18} />}>
                Open Dashboard
              </Button>
            </div>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <SiteFooter />
    </>
  );
}