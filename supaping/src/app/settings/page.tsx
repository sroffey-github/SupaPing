
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Globe,
  LoaderCircle,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type AccountProfile = {
  email: string;
  name: string;
  avatarUrl: string;
  provider: string;
};

export default function SettingsPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<AccountProfile>({
    email: "",
    name: "",
    avatarUrl: "",
    provider: "",
  });

  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();

        if (cancelled) return;

        if (error || !data.user) {
          router.replace("/login");
          return;
        }

        const user = data.user;
        const metadata = user.user_metadata ?? {};
        const providers =
          user.app_metadata?.providers ??
          (user.app_metadata?.provider
            ? [user.app_metadata.provider]
            : []);

        const provider =
          providers.find(
            (item: string) => item === "google" || item === "github"
          ) ??
          (user.app_metadata?.provider === "google" ||
          user.app_metadata?.provider === "github"
            ? user.app_metadata.provider
            : "unknown");

        setProfile({
          email: user.email ?? "",
          name:
            metadata.full_name ||
            metadata.name ||
            metadata.user_name ||
            user.email?.split("@")[0] ||
            "Your account",
          avatarUrl:
            metadata.avatar_url ||
            metadata.picture ||
            metadata.photo_url ||
            "",
          provider,
        });
      } catch {
        if (!cancelled) {
          setError("Couldn't load your account details. Please refresh.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleDeleteAccount() {
    if (confirmation !== "DELETE" || deleting) return;

    setDeleting(true);
    setError("");

    try {
      const response = await fetch("/api/account/delete", {
        method: "DELETE",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          result?.error ||
            "Couldn't delete your account. Please try again."
        );
        setDeleting(false);
        return;
      }

      const supabase = createClient();
      await supabase.auth.signOut();

      router.replace("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setDeleting(false);
    }
  }

  const providerName =
    profile.provider === "google"
      ? "Google"
      : profile.provider === "github"
        ? "GitHub"
        : "Single sign-on";

  const ProviderIcon =
    profile.provider === "github"
        ? GitHubIcon
        : profile.provider === "google"
        ? GoogleIcon
        : null;

  return (
    <main className="min-h-screen bg-[#EEF2F6] px-4 py-10 text-[#334155] sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-on-surface-variant transition hover:bg-white/60 hover:text-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A86B]"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <header className="mb-9 mt-7">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-primary-strong">
            Your workspace
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl">
            Settings
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-on-surface-variant">
            Manage your account and preferences for SupaPing.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Account profile */}
          <section className="rounded-3xl border border-white/80 bg-[#EEF2F6] p-5 shadow-[6px_6px_18px_rgba(166,175,195,0.24),-6px_-6px_18px_rgba(255,255,255,0.85)] sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D9F5E8] text-primary-strong">
                <UserRound size={19} />
              </div>
              <div>
                <h2 className="font-semibold text-[#1E293B]">
                  Your account
                </h2>
                <p className="text-sm text-on-surface-variant">
                  Your profile information
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center gap-3 py-5 text-sm text-on-surface-variant">
                <LoaderCircle size={18} className="animate-spin" />
                Loading account details…
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="h-14 w-14 rounded-full border border-white object-cover shadow-sm"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#D9F5E8] text-lg font-bold text-[#00794D]">
                    {(profile.name || profile.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#1E293B]">
                    {profile.name || "Your account"}
                  </p>
                  <p className="mt-1 break-all text-sm text-on-surface-variant">
                    {profile.email}
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary-strong">
                    <CheckCircle2 size={14} />
                    Account connected
                  </p>
                </div>
              </div>
            )}

            <p className="mt-5 border-t border-[#D9E0E9] pt-4 text-xs leading-5 text-on-surface-variant">
              Your name, email and profile image come from your sign-in
              provider. Profile editing is not currently available in SupaPing.
            </p>
          </section>

          {/* Authentication */}
          <section className="rounded-3xl border border-white/80 bg-[#EEF2F6] p-5 shadow-[6px_6px_18px_rgba(166,175,195,0.24),-6px_-6px_18px_rgba(255,255,255,0.85)] sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D9F5E8] text-primary-strong">
                <ShieldCheck size={19} />
              </div>
              <div>
                <h2 className="font-semibold text-[#1E293B]">
                  Sign-in & security
                </h2>
                <p className="text-sm text-on-surface-variant">
                  How you access your account
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/40 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2F6] text-[#475569]">
                {ProviderIcon ? (
                    <ProviderIcon />
                ) : (
                    <ShieldCheck size={19} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#1E293B]">
                  {providerName}
                </p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  Authentication provider
                </p>
              </div>

              <span className="rounded-full bg-[#D9F5E8] px-2.5 py-1 text-xs font-medium text-[#00794D]">
                Connected
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-on-surface-variant">
              SupaPing uses Google or GitHub for sign-in. Manage your
              password, multi-factor authentication and other sign-in
              security settings through your provider.
            </p>
          </section>

          {/* Legal */}
          <section className="rounded-3xl border border-white/80 bg-[#EEF2F6] p-5 shadow-[6px_6px_18px_rgba(166,175,195,0.24),-6px_-6px_18px_rgba(255,255,255,0.85)] sm:p-7">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D9F5E8] text-primary-strong">
                <Globe size={19} />
              </div>
              <div>
                <h2 className="font-semibold text-[#1E293B]">
                  Legal & privacy
                </h2>
                <p className="text-sm text-on-surface-variant">
                  Your data and our terms
                </p>
              </div>
            </div>

            <Link
              href="/privacy"
              className="flex items-center justify-between rounded-xl px-3 py-3 transition hover:bg-white/60"
            >
              <span className="text-sm font-medium text-[#334155]">
                Privacy policy
              </span>
              <ChevronRight size={17} className="text-text-muted" />
            </Link>

            <Link
              href="/terms"
              className="flex items-center justify-between rounded-xl px-3 py-3 transition hover:bg-white/60"
            >
              <span className="text-sm font-medium text-[#334155]">
                Terms of service
              </span>
              <ChevronRight size={17} className="text-text-muted" />
            </Link>
          </section>

          {/* Danger zone */}
          <section className="rounded-3xl border border-red-200/80 bg-[#FFF9F8] p-5 shadow-[4px_4px_14px_rgba(180,70,70,0.06)] sm:p-7">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <Trash2 size={19} />
              </div>
              <div>
                <h2 className="font-semibold text-red-800">
                  Danger zone
                </h2>
                <p className="text-sm text-red-700/70">
                  Permanently remove your account
                </p>
              </div>
            </div>

            <p className="text-sm leading-6 text-[#7F4545]">
              Deleting your account is permanent. Your SupaPing account and
              associated data will be removed according to the service&apos;s
              deletion process. This action cannot be undone.
            </p>

            <button
              type="button"
              onClick={() => {
                setConfirmation("");
                setError("");
                setDeleteDialogOpen(true);
              }}
              disabled={loading || deleting}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={16} />
              Delete account
            </button>
          </section>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {deleteDialogOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1E293B]/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleting) {
              setDeleteDialogOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            className="w-full max-w-md rounded-3xl border border-white/80 bg-[#EEF2F6] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.25)] sm:p-7"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <Trash2 size={20} />
              </div>
              <button
                type="button"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleting}
                aria-label="Close confirmation"
                className="rounded-lg p-2 text-on-surface-variant transition hover:bg-white/70 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <h2
              id="delete-account-title"
              className="text-xl font-bold text-[#1E293B]"
            >
              Delete your account?
            </h2>

            <p className="mt-3 text-sm leading-6 text-on-surface-variant">
              This permanently deletes your SupaPing account. Make sure you
              understand the consequences before continuing.
            </p>

            <label
              htmlFor="delete-confirmation"
              className="mt-6 block text-sm font-medium text-[#334155]"
            >
              Type <span className="font-mono font-bold">DELETE</span> to
              confirm
            </label>

            <input
              id="delete-confirmation"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              disabled={deleting}
              autoComplete="off"
              spellCheck={false}
              placeholder="Type DELETE"
              className="mt-2 w-full rounded-xl border border-[#D5DDE7] bg-white/70 px-4 py-3 text-sm text-[#1E293B] outline-none transition placeholder:text-text-muted focus:border-red-300 focus:ring-2 focus:ring-red-100 disabled:opacity-60"
            />

            {error && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleting}
                className="rounded-xl border border-white bg-[#EEF2F6] px-4 py-2.5 text-sm font-medium text-[#475569] shadow-sm transition hover:bg-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleDeleteAccount()}
                disabled={confirmation !== "DELETE" || deleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                {deleting ? "Deleting account…" : "Permanently delete"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}


function GitHubIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.23-1.63-1.23-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.7-1.49-2.47-.28-5.07-1.24-5.07-5.5 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.12-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3.01 0 4.27-2.6 5.22-5.08 5.49.4.35.75 1.02.75 2.06V22c0 .29.2.63.77.52A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3A12 12 0 1 1 24 12a11.8 11.8 0 0 1 7.7 2.8l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5Z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8A12 12 0 0 1 24 12c3 0 5.7 1.1 7.7 2.8l5.7-5.7A20 20 0 0 0 24 4 20 20 0 0 0 6.3 14.7Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44a20 20 0 0 0 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.9 29l-6.6 5.1A20 20 0 0 0 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2A20 20 0 0 0 44 24c0-1.2-.1-2.4-.4-3.5Z"
      />
    </svg>
  );
}
