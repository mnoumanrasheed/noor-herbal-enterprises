import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  asChild?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-[#AD7A2B] via-[#F1DD7A] to-[#BC9233] text-[#0f0f0f] font-semibold hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#BC9233] focus-visible:ring-offset-2",
  secondary:
    "border border-[#BC9233] text-[#BC9233] bg-transparent hover:bg-[#f8f0d0] focus-visible:ring-2 focus-visible:ring-[#BC9233] focus-visible:ring-offset-2",
  ghost:
    "text-[#0f0f0f] bg-transparent hover:bg-[#f8f0d0] focus-visible:ring-2 focus-visible:ring-[#BC9233] focus-visible:ring-offset-2",
  danger:
    "bg-[#c0392b] text-white hover:bg-[#96281b] focus-visible:ring-2 focus-visible:ring-[#c0392b] focus-visible:ring-offset-2",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-[6px]",
  md: "px-5 py-2.5 text-base rounded-[8px]",
  lg: "px-7 py-3.5 text-lg rounded-[10px]",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 transition-colors duration-150 outline-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}
