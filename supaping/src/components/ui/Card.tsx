import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
  as?: "div" | "article";
};

const paddingClasses = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const baseCardStyle = {
  background: "#EEF2F6",
  boxShadow:
    "5px 5px 12px rgba(166, 175, 195, 0.3), -5px -5px 12px rgba(255, 255, 255, 0.9), inset 1px 1px 2px rgba(255, 255, 255, 0.7)",
  border: "1px solid rgba(255, 255, 255, 0.6)",
};

export default function Card({
  children,
  padding = "md",
  hover = false,
  className = "",
  style,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={[
        "flex flex-col rounded-3xl",
        paddingClasses[padding],
        hover && "transition-transform hover:-translate-y-0.5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ ...baseCardStyle, ...style }}
    >
      {children}
    </div>
  );
}