"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

import Card from "@/components/ui/Card";
import StatusDot from "@/components/ui/StatusDot";
import GitHubButton from "@/components/auth/GitHubButton";
import GoogleButton from "@/components/auth/GoogleButton";
import SiteFooter from "@/components/layout/SiteFooter";

type OAuthProvider = "github" | "google";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loadingProvider, setLoadingProvider] =
    useState<OAuthProvider | null>(null);

  async function handleOAuth(provider: OAuthProvider) {
    // Prevent duplicate requests while an OAuth attempt is underway.
    if (loadingProvider !== null) return;

    setError("");
    setLoadingProvider(provider);

    try {
      const supabase = createClient();

      const { error: oauthError } =
        await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=%2Fdashboard`,
          },
        });

      if (oauthError) {
        setLoadingProvider(null);
        setError("Unable to sign in. Please try again.");
      }
    } catch {
      setLoadingProvider(null);
      setError("Unable to sign in. Please try again.");
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#EFF3F8] text-[#202124]">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 8% 18%, rgba(0, 168, 107, 0.09), transparent 30%), radial-gradient(ellipse at 95% 90%, rgba(0, 210, 170, 0.10), transparent 30%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="/logo.webp"
            alt=""
            className="h-10 w-10 shrink-0 object-contain"
          />

          <span className="flex flex-col">
            <span className="text-[17px] font-semibold leading-5 tracking-tight">
              Supa<span className="text-primary-strong">Ping</span>
            </span>
            <span className="text-[10px] font-medium leading-3 text-[#52615A]">
              Keep-Alive Infrastructure
            </span>
          </span>
        </Link>
      </header>

      {/* Login area */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-8 pt-5 sm:pt-0">
        <Card
          padding="lg"
          className="w-full max-w-[460px] items-stretch rounded-[28px] bg-white px-6 py-8 sm:px-8 sm:py-10"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.9)",
            boxShadow:
              "12px 18px 38px rgba(148, 163, 184, 0.25), -4px -4px 14px rgba(255,255,255,0.8)",
          }}
        >
          {/* Brand mark */}
          <div className="mb-5 flex flex-col items-center">
            <div className="relative mb-5">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white"
                style={{
                  boxShadow:
                    "5px 5px 12px rgba(166,175,195,0.3), -5px -5px 12px rgba(255,255,255,0.9)",
                }}
              >
                <img
                  src="/logo.webp"
                  alt="SupaPing"
                  className="h-11 w-11 object-contain"
                />
              </div>
            </div>

            <h1 className="text-center text-[30px] font-bold leading-tight tracking-[-1.3px]">
              Welcome back.
            </h1>

            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#F7F5F6] px-3 py-1.5 text-[12px] text-[#52615A]">
              <StatusDot pulse />
              <span className="font-semibold">
                Let&apos;s keep things awake.
              </span>
            </div>
          </div>

          {/* Social sign-in */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <GitHubButton
              onClick={() => void handleOAuth("github")}
              loading={loadingProvider === "github"}
              disabled={loadingProvider !== null}
            />

            <GoogleButton
              onClick={() => void handleOAuth("google")}
              loading={loadingProvider === "google"}
              disabled={loadingProvider !== null}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="mt-3 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          {/* Sign up */}
          <p className="mt-6 text-center text-[13px] text-[#52615A]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#008A58] underline decoration-[#008A58]/50 underline-offset-4 hover:text-[#006E46]"
            >
              Sign up
            </Link>
          </p>
        </Card>
      </section>

      {/* Footer */}
      <SiteFooter />
    </main>
  );
}