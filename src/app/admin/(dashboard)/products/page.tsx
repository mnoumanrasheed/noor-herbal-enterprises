import React from "react";
import type { Metadata } from "next";
import { getAllProducts } from "@/lib/queries";
import { Badge } from "@/components/ui/Badge";
import type { Product } from "@/types";

export const metadata: Metadata = { title: "Products — Admin" };

export default async function AdminProductsPage() {
  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  try {
    products = await getAllProducts();
  } catch {
    products = [];
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Products</h1>
          <p className="text-sm text-[#a09a8f] mt-1">
            {products.length} products total
          </p>
        </div>
      </div>

      <div className="rounded-[12px] border border-[#2e2e2e] bg-[#1c1c1c] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#2e2e2e]">
            <tr>
              {["Name", "Category", "Status", "Featured", "Created"].map((h) => (
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
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[#6b6560]">
                  No products yet. Products will be added through this admin interface.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-[#0f0f0f]/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{product.name}</td>
                  <td className="px-4 py-3 text-[#a09a8f]">
                    {(product as Product & { category_name?: string }).category_name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={product.is_active ? "green" : "red"}>
                      {product.is_active ? "Active" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {product.is_featured ? (
                      <Badge variant="gold">Featured</Badge>
                    ) : (
                      <span className="text-[#6b6560]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6b6560]">
                    {new Date(product.created_at).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
