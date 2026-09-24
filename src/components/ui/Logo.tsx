/**
 * NoorHerbalLogo
 *
 * SVG placeholder logo matching the brand palette (black + gold).
 * Replace the inner SVG artwork with the actual logo file once provided.
 *
 * Props:
 *  variant  - "full" (wordmark + icon) | "mark" (icon only) | "wordmark" (text only)
 *  scheme   - "dark" (gold on black, for dark backgrounds) | "light" (black/gold on white)
 *  size     - height in px
 */

import React from "react";

interface LogoProps {
  variant?: "full" | "mark" | "wordmark";
  scheme?: "dark" | "light";
  size?: number;
  className?: string;
}

export function Logo({
  variant = "full",
  scheme = "light",
  size = 48,
  className = "",
}: LogoProps) {
  const gold = "#c9a84c";
  const black = "#0f0f0f";
  const bg = scheme === "dark" ? black : "transparent";
  const textColor = scheme === "dark" ? gold : black;

  if (variant === "mark") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Noor Herbal Enterprises logo mark"
        role="img"
        className={className}
      >
        <rect width="48" height="48" rx="8" fill={bg === "transparent" ? gold : bg} />
        {/* Stylised leaf / N initial */}
        <path
          d="M12 36 L12 12 L24 30 L24 12 M24 12 L36 36"
          stroke={scheme === "dark" ? gold : "white"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="24" cy="38" r="2" fill={scheme === "dark" ? gold : "white"} />
      </svg>
    );
  }

  if (variant === "wordmark") {
    return (
      <span
        className={className}
        style={{
          fontFamily: "serif",
          fontSize: size * 0.5,
          fontWeight: 600,
          color: textColor,
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}
      >
        Noor Herbal
        <span style={{ display: "block", fontSize: size * 0.28, letterSpacing: "0.15em", color: gold, fontWeight: 400, textTransform: "uppercase" }}>
          Enterprises
        </span>
      </span>
    );
  }

  // Full: mark + wordmark side by side
  return (
    <div
      className={`inline-flex items-center gap-3 ${className}`}
      aria-label="Noor Herbal Enterprises"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="48" height="48" rx="8" fill={gold} />
        <path
          d="M12 36 L12 12 L24 30 L24 12 M24 12 L36 36"
          stroke={black}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="24" cy="40" r="2" fill={black} />
      </svg>
      <div>
        <div
          style={{
            fontFamily: "serif",
            fontSize: size * 0.45,
            fontWeight: 700,
            color: textColor,
            lineHeight: 1.1,
            letterSpacing: "0.02em",
          }}
        >
          Noor Herbal
        </div>
        <div
          style={{
            fontSize: size * 0.22,
            letterSpacing: "0.18em",
            color: gold,
            fontWeight: 500,
            textTransform: "uppercase" as const,
            lineHeight: 1,
          }}
        >
          Enterprises
        </div>
      </div>
    </div>
  );
}
