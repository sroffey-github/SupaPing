"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

type GoogleButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  children?: ReactNode;
};

export default function GoogleButton({
  className = "",
  children = "Google",
  loading = false,
  disabled,
  ...props
}: GoogleButtonProps) {
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
        <GoogleIcon />
      )}

      <span className="leading-none">
        {loading ? "Connecting to Google…" : children}
      </span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg
      className="shrink-0"
      width="17"
      height="17"
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