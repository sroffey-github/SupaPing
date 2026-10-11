"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import StatusPill from "@/components/ui/StatusPill";

type DashboardNavbarProps = {
  email?: string;
  name?: string;
  avatarUrl?: string;
};

type Profile = {
  email: string;
  name: string;
  avatarUrl: string;
};

export default function DashboardNavbar({
  email: initialEmail,
  name: initialName,
  avatarUrl: initialAvatarUrl,
}: DashboardNavbarProps) {
  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [profile, setProfile] = useState<Profile>({
    email: initialEmail ?? "",
    name: initialName ?? "",
    avatarUrl: initialAvatarUrl ?? "",
  });

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (cancelled || error || !data.user) return;

      const user = data.user;
      const metadata = user.user_metadata ?? {};

      const name =
        metadata.full_name ||
        metadata.name ||
        metadata.user_name ||
        metadata.preferred_username ||
        user.email?.split("@")[0] ||
        initialName ||
        "";

      const avatarUrl =
        metadata.avatar_url ||
        metadata.picture ||
        metadata.photo_url ||
        initialAvatarUrl ||
        "";

      setProfile({
        email: user.email ?? initialEmail ?? "",
        name: String(name),
        avatarUrl: String(avatarUrl),
      });
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [initialEmail, initialName, initialAvatarUrl]);

  const displayName =
    profile.name || profile.email || "Your account";

  const initials = (
    profile.name ||
    profile.email?.split("@")[0] ||
    "U"
  )
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  async function handleLogout() {
    setLoggingOut(true);
    setLogoutError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setLoggingOut(false);
      setLogoutError("Couldn't sign out. Please try again.");
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-[#EEF2F6]/90 backdrop-blur-xl">
      <div className="mx-auto grid min-h-[76px] w-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <a
          href="/dashboard"
          aria-label="SupaPing dashboard"
          className="flex min-w-0 items-center gap-2.5 justify-self-start"
        >
          <img
            src="/logo.png"
            alt=""
            className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11"
          />

          <span className="truncate text-xl font-bold tracking-tight text-[#1E293B] sm:text-[22px]">
            Supa<span className="text-[#00A86B]">Ping</span>
          </span>
        </a>

        {/* Overall status */}
        <div className="justify-self-center">
          <StatusPill
            label="All systems"
            secondaryLabel="Operational"
            pulse
          />
        </div>

        {/* Profile and logout */}
        <div className="flex items-center gap-2 justify-self-end sm:gap-3">
          <div
            className="flex min-w-0 items-center gap-2 rounded-full border border-white/80 bg-[#EEF2F6] py-1.5 pl-1.5 pr-3 shadow-[3px_3px_8px_rgba(166,175,195,0.2),-3px_-3px_8px_rgba(255,255,255,0.8)] sm:gap-3"
            title={displayName}
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={`${displayName}'s avatar`}
                referrerPolicy="no-referrer"
                className="h-8 w-8 shrink-0 rounded-full bg-white object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D9F5E8] text-xs font-bold text-[#00794D]">
                {initials || "U"}
              </span>
            )}

            <span className="hidden max-w-[140px] truncate text-sm font-medium text-[#334155] md:block">
              {profile.name ||
                profile.email?.split("@")[0] ||
                "Account"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={loggingOut}
            title={loggingOut ? "Signing out…" : "Log out"}
            aria-label={loggingOut ? "Signing out" : "Log out"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/80 bg-[#EEF2F6] text-[#475569] shadow-[3px_3px_8px_rgba(166,175,195,0.2),-3px_-3px_8px_rgba(255,255,255,0.8)] transition hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A86B] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {logoutError && (
        <p role="alert" className="px-4 pb-3 text-right text-sm text-red-600">
          {logoutError}
        </p>
      )}
    </header>
  );
}