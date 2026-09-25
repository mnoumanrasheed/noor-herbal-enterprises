"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { readCart } from "@/lib/cart";

const CATEGORY_LINKS = [
  { href: "/categories/chutney", label: "Chutney" },
  { href: "/categories/pickles", label: "Pickles" },
  { href: "/categories/oils", label: "Oils" },
  { href: "/categories/shampoo", label: "Shampoo" },
];

const PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Our story" },
  { href: "/contact", label: "Contact" },
];

function CartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h1.5l1.8 10.2a1.5 1.5 0 0 0 1.48 1.24h8.94a1.5 1.5 0 0 0 1.47-1.2L20.25 8.25H6" />
      <circle cx="9" cy="19.25" r="1" />
      <circle cx="17.25" cy="19.25" r="1" />
    </svg>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const syncCart = () => setCartCount(readCart().reduce((total, item) => total + item.quantity, 0));
    syncCart();
    window.addEventListener("noor-cart-updated", syncCart);
    return () => window.removeEventListener("noor-cart-updated", syncCart);
  }, []);

  return (
    <header className="site-header">
      <div className="announcement-bar">
        <div className="site-shell flex min-h-8 items-center justify-center px-4 text-[10px] font-medium uppercase tracking-[0.22em] text-[#bfb7aa] sm:text-[11px]">
          Crafted with care in Pakistan
        </div>
      </div>

      <div className="site-shell flex h-[76px] items-center justify-between gap-6 px-4 sm:px-6 lg:h-[86px] lg:px-8">
        <Link href="/" aria-label="Noor Herbal Enterprises — go to homepage" className="shrink-0 rounded-md bg-white p-1.5 transition-opacity hover:opacity-90">
          <Logo size={48} />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
          {PRIMARY_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="nav-link">{label}</Link>
          ))}
          <div className="group relative">
            <Link href="/categories" className="nav-link inline-flex items-center gap-1.5">
              Categories
              <span aria-hidden="true" className="text-[10px] text-brand-gold">⌄</span>
            </Link>
            <div className="invisible absolute left-1/2 top-full z-20 mt-4 w-48 -translate-x-1/2 rounded-xl border border-[#39342d] bg-[#171614] p-2 opacity-0 shadow-2xl transition-all group-hover:visible group-hover:mt-3 group-hover:opacity-100 group-focus-within:visible group-focus-within:mt-3 group-focus-within:opacity-100">
              {CATEGORY_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} className="block rounded-lg px-3 py-2.5 text-sm text-[#c5bdb1] hover:bg-[#25221d] hover:text-brand-gold">{label}</Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/categories" className="button-primary hidden sm:inline-flex">Shop now</Link>
          <Link href="/cart" className="icon-button relative" aria-label={`Shopping cart${cartCount ? `, ${cartCount} items` : ""}`}>
            <CartIcon />
            {cartCount > 0 ? <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c9a84c] px-1 text-[9px] font-bold text-[#11100f]">{cartCount}</span> : null}
            <span className="sr-only">Cart</span>
          </Link>
          <button
            type="button"
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="icon-button lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <span aria-hidden="true" className="relative block h-5 w-5">
              <span className={`menu-line top-1 ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`menu-line top-2.5 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`menu-line top-4 ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="border-t border-[#39342d] bg-[#11100f] lg:hidden">
          <nav aria-label="Mobile navigation" className="site-shell px-4 py-5 sm:px-6">
            <div className="grid grid-cols-2 gap-1">
              {PRIMARY_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)} className="mobile-nav-link">{label}</Link>
              ))}
              <Link href="/categories" onClick={() => setMobileOpen(false)} className="mobile-nav-link">All categories</Link>
              <Link href="/cart" onClick={() => setMobileOpen(false)} className="mobile-nav-link">Cart</Link>
            </div>
            <div className="mt-5 border-t border-[#39342d] pt-4">
              <p className="eyebrow mb-3">Browse the collection</p>
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
                {CATEGORY_LINKS.map(({ href, label }) => (
                  <Link key={href} href={href} onClick={() => setMobileOpen(false)} className="mobile-category-link">{label}</Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
