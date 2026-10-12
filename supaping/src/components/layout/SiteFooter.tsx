
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer
      className="w-full border-t py-6"
      style={{
        background: "#EEF2F6",
        borderTop: "1px solid rgba(166, 175, 195, 0.25)",
        color: "#475569",
      }}
    >
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <Link
          href="/"
          className="font-mono text-[12px] text-[#52615A] transition-colors hover:text-primary-strong"
        >
          Supa<span className="text-primary-strong">Ping</span>
          <span className="text-text-muted"> // Keep-Alive Infrastructure</span>
        </Link>

        <nav
          aria-label="Legal links"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px]"
        >
          <Link
            href="/terms"
            className="transition-colors hover:text-primary-strong"
          >
            Terms of Service
          </Link>

          <Link
            href="/privacy"
            className="transition-colors hover:text-primary-strong"
          >
            Privacy Policy
          </Link>
        </nav>

        <span className="text-center font-mono text-[11px] text-text-muted">
          © 2026 SupaPing
        </span>
      </div>
    </footer>
  );
}
