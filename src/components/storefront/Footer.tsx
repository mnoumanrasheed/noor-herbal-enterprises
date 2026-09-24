import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const SHOP_LINKS = [
  { href: "/categories/chutney", label: "Chutney" },
  { href: "/categories/pickles", label: "Pickles" },
  { href: "/categories/oils",    label: "Oils" },
  { href: "/categories/shampoo", label: "Shampoo" },
];

const INFO_LINKS = [
  { href: "/about",   label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/shipping", label: "Shipping Policy" },
  { href: "/returns",  label: "Return Policy" },
  { href: "/privacy",  label: "Privacy Policy" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#e8e3d9] bg-[#0f0f0f] text-[#d4cfc5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo variant="full" scheme="dark" size={40} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#a09a8f]">
              Pure, natural, and handcrafted products rooted in tradition.
              Bringing the goodness of nature to your table and daily care.
            </p>
          </div>

          {/* Shop */}
          <nav aria-label="Shop categories">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#c9a84c] mb-4">
              Shop
            </h3>
            <ul className="space-y-2">
              {SHOP_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[#a09a8f] hover:text-[#c9a84c] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Info */}
          <nav aria-label="Company information">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#c9a84c] mb-4">
              Information
            </h3>
            <ul className="space-y-2">
              {INFO_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[#a09a8f] hover:text-[#c9a84c] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-[#2e2e2e] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6b6560]">
            &copy; {new Date().getFullYear()} Noor Herbal Enterprises. All rights reserved.
          </p>
          <p className="text-xs text-[#6b6560]">
            Made with care in India
          </p>
        </div>
      </div>
    </footer>
  );
}
