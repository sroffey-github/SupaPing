import type { HTMLAttributes } from "react";
import StatusDot from "./StatusDot";

type StatusPillProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  secondaryLabel?: string;
  pulse?: boolean;
};

export default function StatusPill({
  label,
  secondaryLabel,
  pulse = false,
  className = "",
  ...props
}: StatusPillProps) {
  return (
    <div
      {...props}
      className={[
        "inline-flex self-start items-center gap-2 rounded-full px-3.5 py-1.5",
        "font-mono text-[13px] font-medium text-[#006e46]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        background: "#EEF2F6",
        boxShadow:
          "3px 3px 8px rgba(166, 175, 195, 0.35), -3px -3px 8px rgba(255, 255, 255, 0.95), inset 1px 1px 2px rgba(255, 255, 255, 0.8)",
        border: "1px solid rgba(255, 255, 255, 0.7)",
        ...props.style,
      }}
    >
      <StatusDot pulse={pulse} />

      <span className="font-semibold uppercase tracking-wide">
        {label}
      </span>

      {secondaryLabel && (
        <>
          <span className="text-[#94A3B8]">•</span>
          <span className="text-[#334155]">{secondaryLabel}</span>
        </>
      )}
    </div>
  );
}