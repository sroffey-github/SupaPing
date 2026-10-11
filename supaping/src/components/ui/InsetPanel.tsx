import type { HTMLAttributes, ReactNode } from "react";

type InsetPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: "default" | "subtle";
};

const variants = {
  default: {
    background: "#F8FAFC",
    boxShadow:
      "inset 3px 3px 6px rgba(166, 175, 195, 0.3), inset -3px -3px 6px rgba(255, 255, 255, 0.8)",
  },
  subtle: {
    background: "#EEF2F6",
    boxShadow:
      "inset 2px 2px 4px rgba(166, 175, 195, 0.3), inset -2px -2px 4px rgba(255, 255, 255, 0.8)",
  },
};

export default function InsetPanel({
  children,
  variant = "default",
  className = "",
  style,
  ...props
}: InsetPanelProps) {
  return (
    <div
      {...props}
      className={`rounded-2xl border border-white/70 ${className}`}
      style={{ ...variants[variant], ...style }}
    >
      {children}
    </div>
  );
}