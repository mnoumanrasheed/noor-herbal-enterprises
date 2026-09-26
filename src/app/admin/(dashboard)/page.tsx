import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getAdminDashboardSummary } from "@/lib/queries";

export const metadata: Metadata = { title: "Admin Dashboard — Noor Herbal Enterprises" };

export default async function AdminDashboardPage() {
  let summary = {
    categoryCount: 0,
    productCount: 0,
    publishedProductCount: 0,
    draftProductCount: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  };

  try {
    const data = await getAdminDashboardSummary();
    summary = {
      categoryCount: data.categoryCount,
      productCount: data.productCount,
      publishedProductCount: data.publishedProductCount,
      draftProductCount: data.draftProductCount,
      lowStockCount: data.lowStockCount,
      outOfStockCount: data.outOfStockCount,
    };
  } catch {
    /* fallback to defaults */
  }

  const statCards = [
    {
      label: "Total Categories",
      value: summary.categoryCount,
      sub: "Active catalogue categories",
      valueColor: "text-[#b8913f]",
      iconBg: "bg-[#c9a84c]/10",
      icon: "◫",
      href: "/admin/categories",
    },
    {
      label: "Published Products",
      value: summary.publishedProductCount,
      sub: `${summary.draftProductCount} draft(s)`,
      valueColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      icon: "🛍️",
      href: "/admin/products",
    },
    {
      label: "Total Products",
      value: summary.productCount,
      sub: "Catalogue items count",
      valueColor: "text-blue-600",
      iconBg: "bg-blue-50",
      icon: "⊠",
      href: "/admin/products",
    },
    {
      label: "Inventory Alerts",
      value: `${summary.lowStockCount + summary.outOfStockCount}`,
      sub: `${summary.outOfStockCount} out of stock, ${summary.lowStockCount} low`,
      valueColor: summary.outOfStockCount > 0 ? "text-red-600" : summary.lowStockCount > 0 ? "text-amber-600" : "text-[#374151]",
      iconBg: "bg-red-50",
      icon: "⚠️",
      href: "/admin/inventory",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[#111827] mb-1">
          Store Administration
        </h1>
        <p className="text-sm text-[#6b7280]">
          Overview of catalogue, inventory, and storefront performance metrics.
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="group">
            <div className="rounded-2xl border border-[#e2e5ee] bg-white p-5 h-full flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#c9a84c]/40 transition-all duration-200">
              <div className="flex items-start justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#9ca3af] mb-3">
                  {card.label}
                </p>
                <span className={`text-xl rounded-xl p-1.5 ${card.iconBg}`}>{card.icon}</span>
              </div>
              <div>
                <p className={`font-display text-3xl font-bold ${card.valueColor}`}>
                  {card.value}
                </p>
                <p className="text-xs text-[#9ca3af] mt-2">{card.sub}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Action Navigation */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9ca3af] mb-4">
          Quick Management
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/admin/products/new", label: "+ Add New Product" },
            { href: "/admin/categories/new", label: "+ Add New Category" },
            { href: "/admin/products", label: "Manage Products" },
            { href: "/admin/inventory", label: "Manage Inventory & Stock" },
            { href: "/admin/settings", label: "Store Settings" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl border border-[#e2e5ee] bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#374151] hover:border-[#c9a84c]/60 hover:text-[#b8913f] hover:bg-[#c9a84c]/5 transition-all shadow-sm"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
