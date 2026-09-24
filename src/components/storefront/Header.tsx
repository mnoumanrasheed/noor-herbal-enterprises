"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const NAV_LINKS = [
  { href: "/",            label: "Home" },
  { href: "/categories",  label: "Shop" },
  { href: "/about",       label: "About" },
  { href: "/contact",     label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e8e3d9] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" aria-label="Noor Herbal Enterprises — go to homepage">
            <Logo variant="full" size={36} />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-[#1c1c1c] hover:text-[#c9a84c] transition-colors duration-150"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              type="button"
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
              className="inline-flex items-center justify-center rounded-md p-2 text-[#1c1c1c] hover:bg-[#f5eecf] transition-colors md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <span aria-hidden="true" className="block h-5 w-5">
                {mobileOpen ? (
                  /* X icon */
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  /* Hamburger */
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="border-t border-[#e8e3d9] bg-white md:hidden"
        >
          <ul className="divide-y divide-[#e8e3d9]">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-6 py-4 text-base font-medium text-[#1c1c1c] hover:bg-[#f5eecf] hover:text-[#c9a84c] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
