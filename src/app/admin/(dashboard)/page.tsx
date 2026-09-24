import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getAllCategories, getAllProducts } from "@/lib/queries";

export const metadata: Metadata = { title: "Admin Dashboard" };

async function getDashboardStats() {
  try {
    const [categories, products] = await Promise.all([
      getAllCategories(),
      getAllProducts(),
    ]);
    return {
      categories: categories.length,
      products: products.length,
      activeProducts: products.filter((p) => p.is_active).length,
    };
  } catch {
    return { categories: 0, products: 0, activeProducts: 0 };
  }
}

const STAT_LINKS = [
  { label: "Categories",       href: "/admin/categories", color: "text-[#c9a84c]" },
  { label: "Products",         href: "/admin/products",   color: "text-[#c9a84c]" },
  { label: "Active Products",  href: "/admin/products",   color: "text-green-400" },
  { label: "Orders",           href: "/admin/orders",     color: "text-blue-400" },
];

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statValues = [stats.categories, stats.products, stats.activeProducts, 0];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white mb-1">Dashboard</h1>
      <p className="text-sm text-[#a09a8f] mb-8">
        Welcome back. Here's an overview of your store.
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {STAT_LINKS.map(({ label, href, color }, i) => (
          <Link key={label} href={href}>
            <Card
              className="border-[#2e2e2e] bg-[#1c1c1c] hover:border-[#c9a84c]/40 transition-colors cursor-pointer"
              padding="md"
            >
              <p className="text-xs font-medium uppercase tracking-widest text-[#6b6560] mb-2">
                {label}
              </p>
              <p className={`font-display text-4xl font-bold ${color}`}>
                {statValues[i]}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/admin/categories", label: "Manage Categories" },
            { href: "/admin/products",   label: "Add Product" },
            { href: "/admin/orders",     label: "View Orders" },
            { href: "/admin/settings",   label: "Site Settings" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-[8px] border border-[#2e2e2e] bg-[#1c1c1c] px-4 py-2.5 text-sm font-medium text-[#a09a8f] hover:border-[#c9a84c]/50 hover:text-[#c9a84c] transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
