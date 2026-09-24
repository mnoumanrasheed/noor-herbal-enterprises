import React from "react";
import type { Metadata } from "next";
import { getAllCategories } from "@/lib/queries";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Categories — Admin" };

export default async function AdminCategoriesPage() {
  let categories: Awaited<ReturnType<typeof getAllCategories>> = [];
  try {
    categories = await getAllCategories();
  } catch {
    categories = [];
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Categories</h1>
          <p className="text-sm text-[#a09a8f] mt-1">
            {categories.length} categories total
          </p>
        </div>
      </div>

      <div className="rounded-[12px] border border-[#2e2e2e] bg-[#1c1c1c] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#2e2e2e]">
            <tr>
              {["Name", "Slug", "Products", "Status", "Order"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[#6b6560]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2e2e2e]">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#6b6560]">
                  No categories found. Run{" "}
                  <code className="rounded bg-[#0f0f0f] px-1 py-0.5 font-mono text-[#c9a84c]">
                    npm run db:seed
                  </code>{" "}
                  to seed initial data.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#0f0f0f]/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{cat.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#a09a8f]">
                    {cat.slug}
                  </td>
                  <td className="px-4 py-3 text-[#a09a8f]">—</td>
                  <td className="px-4 py-3">
                    <Badge variant={cat.is_active ? "green" : "red"}>
                      {cat.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[#6b6560]">{cat.sort_order}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
