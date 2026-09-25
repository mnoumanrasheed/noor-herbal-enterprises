import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[#c5bdb1]"
        >
          {label}
          {props.required && (
            <span className="ml-1 text-[#c0392b]" aria-hidden="true">*</span>
          )}
        </label>
      )}
      <input
        id={inputId}
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        aria-invalid={error ? "true" : undefined}
        className={[
          "w-full rounded-[8px] border bg-white px-3 py-2.5 text-[#0f0f0f] text-base",
          "placeholder:text-[#9e9e9e] outline-none transition-colors duration-150",
          "focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20",
          error
            ? "border-[#c0392b] focus:border-[#c0392b] focus:ring-[#c0392b]/20"
            : "border-[#e8e3d9]",
          "disabled:bg-[#f5f5f5] disabled:cursor-not-allowed",
          className,
        ].join(" ")}
        {...props}
      />
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-[#4a4a4a]">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="text-xs text-[#c0392b]"
        >
          {error}
        </p>
      )}
    </div>
  );
}
