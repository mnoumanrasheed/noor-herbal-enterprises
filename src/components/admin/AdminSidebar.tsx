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
  { href: "/admin",             label: "Dashboard",  icon: "⊞" },
  { href: "/admin/categories",  label: "Categories", icon: "◫" },
  { href: "/admin/products",    label: "Products",   icon: "⊠" },
  { href: "/admin/orders",      label: "Orders",     icon: "◱" },
  { href: "/admin/settings",    label: "Settings",   icon: "⚙" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={[
        "flex flex-col border-r border-[#2e2e2e] bg-[#0f0f0f] transition-all duration-200",
        collapsed ? "w-16" : "w-60",
      ].join(" ")}
      aria-label="Admin sidebar"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-[#2e2e2e] px-4">
        {!collapsed && <Logo variant="wordmark" scheme="dark" size={32} />}
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-8 w-8 items-center justify-center rounded-md text-[#a09a8f] hover:bg-[#2e2e2e] hover:text-[#c9a84c] transition-colors"
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
                    "flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#c9a84c]/15 text-[#c9a84c]"
                      : "text-[#a09a8f] hover:bg-[#1c1c1c] hover:text-[#e0c47a]",
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

      {/* Bottom: sign out */}
      <div className="border-t border-[#2e2e2e] p-3">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            title={collapsed ? "Sign out" : undefined}
            className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium text-[#a09a8f] hover:bg-[#1c1c1c] hover:text-[#e0c47a] transition-colors"
          >
            <span aria-hidden="true" className="flex-shrink-0">⏻</span>
            {!collapsed && <span>Sign out</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
