"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "⊞" },
  { href: "/admin/categories", label: "Categories", icon: "◫" },
  { href: "/admin/products", label: "Products", icon: "⊠" },
  { href: "/admin/inventory", label: "Inventory", icon: "▥" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={[
        "flex flex-col border-r border-[#e2e5ee] bg-white transition-all duration-200 shadow-sm",
        collapsed ? "w-16" : "w-60",
      ].join(" ")}
      aria-label="Admin sidebar"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-[#e2e5ee] px-4">
        {!collapsed && <Logo variant="wordmark" scheme="light" size={32} />}
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-8 w-8 items-center justify-center rounded-md text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#c9a84c] transition-colors"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation */}
      <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {NAV_ITEMS.map(({ href, label, icon }) => {
            const isActive =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  title={collapsed ? label : undefined}
                  className={[
                    "flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-[#c9a84c]/10 text-[#b8913f] border border-[#c9a84c]/25"
                      : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#374151]",
                  ].join(" ")}
                >
                  <span
                    className="flex-shrink-0 text-base"
                    aria-hidden="true"
                  >
                    {icon}
                  </span>
                  {!collapsed && <span>{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* View Live Store */}
      <div className="px-3 pb-2">
        <Link
          href="/"
          target="_blank"
          className="flex w-full items-center gap-2 rounded-[8px] border border-[#e2e5ee] bg-[#fafafa] px-3 py-2 text-xs font-medium text-[#c9a84c] hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/5 transition-colors"
        >
          <span>🌐</span>
          {!collapsed && <span>View Live Store ↗</span>}
        </Link>
      </div>

      {/* Bottom: sign out */}
      <div className="border-t border-[#e2e5ee] p-3">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            title={collapsed ? "Sign out" : undefined}
            className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium text-[#6b7280] hover:bg-[#fee2e2] hover:text-[#dc2626] transition-colors"
          >
            <span aria-hidden="true" className="flex-shrink-0">⏻</span>
            {!collapsed && <span>Sign out</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
