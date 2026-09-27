import React from "react";

type BadgeVariant = "gold" | "green" | "red" | "gray" | "blue";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  gold:  "bg-[#f8f0d0] text-[#AD7A2B] border border-[#BC9233]/40",
  green: "bg-green-50 text-green-800 border border-green-200",
  red:   "bg-red-50 text-red-700 border border-red-200",
  gray:  "bg-[#f5f5f5] text-[#4a4a4a] border border-[#e8e3d9]",
  blue:  "bg-blue-50 text-blue-700 border border-blue-200",
};

export function Badge({ variant = "gray", children, className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
