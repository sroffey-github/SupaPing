
"use client";

import { useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
  hint?: string;
  showPasswordToggle?: boolean;
  wrapperClassName?: string;
};

export default function Input({
  label,
  leftIcon,
  rightIcon,
  error,
  hint,
  showPasswordToggle = false,
  wrapperClassName = "",
  className = "",
  type = "text",
  id,
  ...props
}: InputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputId = id ?? props.name ?? label?.toLowerCase().replace(/\s+/g, "-");
  const isPassword = type === "password";
  const inputType =
    isPassword && showPasswordToggle
      ? passwordVisible
        ? "text"
        : "password"
      : type;

  return (
    <div className={`flex min-w-0 flex-col gap-2 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[13px] font-semibold tracking-tight text-[#1E293B]"
        >
          {label}
        </label>
      )}

      <div
        className={[
          "flex min-w-0 items-center gap-3 rounded-xl border px-3.5",
          "transition-all duration-200",
          "focus-within:border-[#00A86B]/40 focus-within:ring-2 focus-within:ring-[#00A86B]/10",
          error
            ? "border-red-300"
            : "border-transparent",
        ].join(" ")}
        style={{
          minHeight: "44px",
          background: "#F7F5F6",
          boxShadow:
            "inset 2px 2px 5px rgba(166, 175, 195, 0.22), inset -2px -2px 5px rgba(255, 255, 255, 0.85)",
        }}
      >
        {leftIcon && (
          <span className="shrink-0 text-[#84918A]">{leftIcon}</span>
        )}

        <input
          {...props}
          id={inputId}
          type={inputType}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? `${inputId}-error`
              : hint
                ? `${inputId}-hint`
                : undefined
          }
          className={[
            "min-w-0 flex-1 bg-transparent py-3 text-[13px]",
            "text-[#1E293B] outline-none placeholder:text-text-muted",
            className,
          ].join(" ")}
        />

        {isPassword && showPasswordToggle ? (
          <button
            type="button"
            onClick={() => setPasswordVisible((visible) => !visible)}
            className="shrink-0 rounded-md p-1 text-[#84918A] transition-colors hover:text-[#006E46] focus-visible:outline-2 focus-visible:outline-[#00A86B]"
            aria-label={passwordVisible ? "Hide password" : "Show password"}
          >
            {passwordVisible ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        ) : (
          rightIcon && (
            <span className="shrink-0 text-[#84918A]">{rightIcon}</span>
          )
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-600">
          {error}
        </p>
      )}

      {!error && hint && (
        <p id={`${inputId}-hint`} className="text-xs text-on-surface-variant">
          {hint}
        </p>
      )}
    </div>
  );
}