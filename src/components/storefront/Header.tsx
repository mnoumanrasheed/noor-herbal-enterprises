"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { readCart } from "@/lib/cart";

const DEFAULT_CATEGORY_LINKS = [
  { href: "/categories/chutney", label: "Chutney" },
  { href: "/categories/pickles", label: "Pickles" },
  { href: "/categories/oils", label: "Oils" },
  { href: "/categories/shampoo", label: "Shampoo" },
];

const PRIMARY_LINKS = [
  { href: "/categories", label: "Collection" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

function SearchIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}

function CartIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h1.5l1.8 10.2a1.5 1.5 0 0 0 1.48 1.24h8.94a1.5 1.5 0 0 0 1.47-1.2L20.25 8.25H6" />
      <circle cx="9" cy="19.25" r="1" />
      <circle cx="17.25" cy="19.25" r="1" />
    </svg>
  );
}

interface HeaderProps {
  categories?: { name: string; slug: string }[];
  announcementText?: string;
}

export function Header({
  categories = [],
  announcementText = "ROOTED IN TRADITION • CRAFTED IN PAKISTAN • DIRECT WHATSAPP ORDERING",
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  const categoryLinks = categories.length > 0
    ? categories.map((c) => ({ href: `/categories/${c.slug}`, label: c.name }))
    : DEFAULT_CATEGORY_LINKS;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync cart count
  useEffect(() => {
    const syncCart = () => setCartCount(readCart().reduce((total, item) => total + item.quantity, 0));
    syncCart();
    window.addEventListener("noor-cart-updated", syncCart);
    return () => window.removeEventListener("noor-cart-updated", syncCart);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Handle ESC key and scroll lock
  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  return (
    <header
      className={`site-header fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? "bg-[#0a0908]/92 backdrop-blur-md border-b border-[#2d2924]/80 shadow-2xl"
          : "bg-gradient-to-b from-[#080706]/85 via-[#080706]/40 to-transparent border-b border-white/5"
      }`}
    >
      {/* Top Announcement Bar */}
      <div className="announcement-bar border-b border-white/5 bg-[#12100e]/40">
        <div className="site-shell flex min-h-7 items-center justify-center px-4 py-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c9a84c] text-center">
          {announcementText}
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="site-shell site-header-main px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo (Links to Home) */}
        <Link
          href="/"
          aria-label="Noor Herbal Enterprises — go to homepage"
          className="site-brand-link flex items-center"
        >
          <Logo size={48} />
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main navigation" className="site-nav hidden lg:flex items-center gap-8">
          {/* Categories Dropdown */}
          <div className="nav-categories group relative py-2">
            <Link
              href="/categories"
              className={`nav-link inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] font-semibold transition-colors ${
                pathname.startsWith("/categories") ? "text-[#c9a84c]" : "text-[#e0d8cc] hover:text-[#c9a84c]"
              }`}
            >
              Collection
              <span aria-hidden="true" className="nav-chevron text-[10px] transition-transform group-hover:rotate-180">⌄</span>
            </Link>
            <div className="nav-dropdown invisible absolute left-1/2 top-full z-30 mt-2 w-60 -translate-x-1/2 rounded-2xl border border-[#38332a] bg-[#12100e]/95 backdrop-blur-xl p-3 shadow-2xl opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8e8578] border-b border-[#2d2924] mb-2">
                By Category
              </p>
              <div className="space-y-1">
                {categoryLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-[#d8d2c7] hover:bg-[#201c17] hover:text-[#c9a84c] transition-colors"
                  >
                    <span>{label}</span>
                    <span aria-hidden="true" className="text-xs text-[#8e8578]">→</span>
                  </Link>
                ))}
              </div>
              <div className="mt-2 border-t border-[#2d2924] pt-2">
                <Link
                  href="/categories"
                  className="block text-center text-[11px] font-semibold uppercase tracking-wider text-[#c9a84c] hover:underline py-1"
                >
                  View All Categories →
                </Link>
              </div>
            </div>
          </div>

          {PRIMARY_LINKS.filter((l) => l.href !== "/categories").map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link text-xs uppercase tracking-[0.16em] font-semibold transition-colors ${
                pathname === href ? "text-[#c9a84c]" : "text-[#e0d8cc] hover:text-[#c9a84c]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Action icons & buttons */}
        <div className="site-header-actions flex items-center gap-3">
          {/* Search Button */}
          <Link
            href="/search"
            aria-label="Search the catalogue"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#3a352d]/60 bg-[#161310]/70 text-[#e0d8cc] hover:border-[#c9a84c]/60 hover:text-[#c9a84c] transition-colors backdrop-blur-sm"
          >
            <SearchIcon className="w-4 h-4" />
          </Link>

          {/* Cart Icon & Count Badge */}
          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#3a352d]/60 bg-[#161310]/70 text-[#e0d8cc] hover:border-[#c9a84c]/60 hover:text-[#c9a84c] transition-colors backdrop-blur-sm"
            aria-label={`Shopping cart${cartCount ? `, ${cartCount} items` : ""}`}
          >
            <CartIcon className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c9a84c] px-1 text-[9px] font-bold text-[#0e0d0c] shadow">
                {cartCount}
              </span>
            )}
            <span className="sr-only">Cart</span>
          </Link>

          {/* Primary CTA Shop Button */}
          <Link
            href="/categories"
            className="button-primary hidden sm:inline-flex text-[11px] uppercase tracking-[0.16em] px-4 py-2 font-bold"
          >
            Shop Now
          </Link>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#3a352d]/60 bg-[#161310]/70 text-[#e0d8cc] lg:hidden hover:text-[#c9a84c] transition-colors backdrop-blur-sm"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <span aria-hidden="true" className="relative block h-4 w-4">
              <span className={`menu-line top-1 ${mobileOpen ? "rotate-45 translate-y-1" : ""}`} />
              <span className={`menu-line top-2 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`menu-line top-3 ${mobileOpen ? "-rotate-45 -translate-y-1" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="site-mobile-menu lg:hidden fixed inset-x-0 top-[calc(100%+1px)] z-50 max-h-[85vh] overflow-y-auto border-b border-[#38332a] bg-[#100e0c]/98 backdrop-blur-xl p-6 shadow-2xl">
          <nav aria-label="Mobile navigation" className="space-y-6">
            <div>
              <Link
                href="/search"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl border border-[#38332a] bg-[#1a1715] px-4 py-3 text-sm text-[#aaa39a] hover:border-[#c9a84c]"
              >
                <SearchIcon className="w-4 h-4 text-[#c9a84c]" />
                <span>Search products, categories...</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/categories"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg bg-[#1a1715] p-3 text-sm font-medium text-white hover:text-[#c9a84c]"
              >
                Collection
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg bg-[#1a1715] p-3 text-sm font-medium text-white hover:text-[#c9a84c]"
              >
                Our Story
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg bg-[#1a1715] p-3 text-sm font-medium text-white hover:text-[#c9a84c]"
              >
                Contact
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg bg-[#1a1715] p-3 text-sm font-medium text-[#c9a84c]"
              >
                Cart ({cartCount})
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
