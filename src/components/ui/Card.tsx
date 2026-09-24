import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm:   "p-4",
  md:   "p-6",
  lg:   "p-8",
};

export function Card({ children, className = "", padding = "md" }: CardProps) {
  return (
    <div
      className={[
        "rounded-[12px] border border-[#e8e3d9] bg-white shadow-sm",
        paddingMap[padding],
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
