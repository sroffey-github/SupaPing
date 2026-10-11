
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  LoaderCircle,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
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
  const menuRef = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
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

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const displayName = profile.name || profile.email || "Your account";

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
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        setLogoutError("Couldn't sign out. Please try again.");
        setLoggingOut(false);
        return;
      }

      setMenuOpen(false);
      router.replace("/login");
      router.refresh();
    } catch {
      setLogoutError("Couldn't sign out. Please try again.");
      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-[#EEF2F6]/90 backdrop-blur-xl">
      <div className="mx-auto grid min-h-[76px] w-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
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
        </Link>

        {/* Overall status */}
        <div className="justify-self-center">
          <StatusPill
            label="All systems"
            secondaryLabel="Operational"
            pulse
          />
        </div>

        {/* Profile dropdown */}
        <div ref={menuRef} className="relative justify-self-end">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Open account menu"
            disabled={loggingOut}
            className="flex max-w-[230px] items-center gap-2 rounded-full border border-white/80 bg-[#EEF2F6] py-1.5 pl-1.5 pr-3 shadow-[3px_3px_8px_rgba(166,175,195,0.2),-3px_-3px_8px_rgba(255,255,255,0.8)] transition hover:shadow-[inset_2px_2px_5px_rgba(166,175,195,0.18),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A86B] disabled:cursor-not-allowed disabled:opacity-60 sm:gap-3"
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt=""
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

            <span className="hidden max-w-[120px] truncate text-sm font-medium text-[#334155] md:block">
              {profile.name || profile.email?.split("@")[0] || "Account"}
            </span>

            <ChevronDown
              size={15}
              className={`shrink-0 text-[#64748B] transition-transform ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              aria-label="Account menu"
              className="absolute right-0 top-[calc(100%+12px)] z-50 w-[260px] overflow-hidden rounded-2xl border border-white/80 bg-[#EEF2F6] p-2 shadow-[8px_8px_24px_rgba(166,175,195,0.28),-8px_-8px_24px_rgba(255,255,255,0.9)]"
            >
              {/* Account details */}
              <div className="border-b border-[#D9E0E9] px-3 py-3">
                <p className="truncate text-sm font-semibold text-[#1E293B]">
                  {displayName}
                </p>
                {profile.email && (
                  <p className="mt-1 truncate text-xs text-[#64748B]">
                    {profile.email}
                  </p>
                )}
              </div>

              <div className="space-y-1 py-2">
                <Link
                  href="/settings"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-white/70 hover:text-[#008756] focus-visible:outline-2 focus-visible:outline-[#00A86B]"
                >
                  <Settings size={17} className="text-[#64748B]" />
                  <span>Settings</span>
                </Link>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => void handleLogout()}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50/80 focus-visible:outline-2 focus-visible:outline-red-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loggingOut ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <LogOut size={17} />
                  )}

                  <span>
                    {loggingOut ? "Signing out…" : "Log out"}
                  </span>

                  {loggingOut && (
                    <span className="sr-only">Please wait</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {logoutError && (
        <div className="flex items-center justify-end gap-2 px-4 pb-3 text-sm text-red-600">
          <span role="alert">{logoutError}</span>
          <button
            type="button"
            onClick={() => setLogoutError("")}
            aria-label="Dismiss sign-out error"
            className="rounded p-1 hover:bg-red-50"
          >
            <Check size={14} />
          </button>
        </div>
      )}
    </header>
  );
}
