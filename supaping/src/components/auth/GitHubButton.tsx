"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

type GitHubButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  children?: ReactNode;
};

export default function GitHubButton({
  className = "",
  children = "GitHub",
  loading = false,
  disabled,
  ...props
}: GitHubButtonProps) {
  return (
    <button
      {...props}
      type={props.type ?? "button"}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`inline-flex min-h-12 w-full flex-row items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-white bg-white px-4 py-3 text-sm font-medium text-[#202124] shadow-[3px_4px_10px_rgba(148,163,184,0.22)] transition hover:bg-[#F8FAFC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A86B] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {loading ? (
        <LoaderCircle
          size={17}
          className="shrink-0 animate-spin"
          aria-hidden="true"
        />
      ) : (
        <svg
          className="shrink-0"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.23-1.63-1.23-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.7-1.49-2.47-.28-5.07-1.24-5.07-5.5 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.12-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3.01 0 4.27-2.6 5.22-5.08 5.49.4.35.75 1.02.75 2.06V22c0 .29.2.63.77.52A11.1 11.1 0 0 0 12 .9Z" />
        </svg>
      )}

      <span className="leading-none">
        {loading ? "Connecting to GitHub…" : children}
      </span>
    </button>
  );
}