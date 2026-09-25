import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/queries";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Categories — Admin" };

export default async function AdminCategoriesPage() {
  let categories: Awaited<ReturnType<typeof getAllCategories>> = [];
  let error = "";
  try { categories = await getAllCategories(); } catch { error = "The catalogue could not be loaded. Check the database connection."; }

  return <div>
    <div className="admin-page-heading"><div><p className="eyebrow">Catalogue structure</p><h1>Categories</h1><p>{error || `${categories.length} categories total`}</p></div><Link href="/admin/categories/new" className="button-primary">Add category</Link></div>
    {error ? <div className="admin-alert" role="alert">{error}</div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr>{["Name", "Slug", "Products", "Status", "Order", "Action"].map((heading) => <th key={heading}>{heading}</th>)}</tr></thead><tbody>
      {categories.length === 0 ? <tr><td colSpan={6} className="admin-empty">No categories yet. Create the first collection.</td></tr> : categories.map((category) => <tr key={category.id}>
        <td><div className="font-medium text-white">{category.name}</div><div className="text-xs text-[#777067]">{category.description || "No description"}</div></td><td className="font-mono text-xs text-[#aaa39a]">{category.slug}</td><td className="text-[#aaa39a]">{(category as typeof category & { product_count?: number }).product_count ?? 0}</td><td><Badge variant={category.is_active ? "green" : "red"}>{category.is_active ? "Visible" : "Hidden"}</Badge></td><td className="text-[#aaa39a]">{category.sort_order}</td><td><Link href={`/admin/categories/${category.id}`} className="admin-row-link">Edit</Link></td>
      </tr>)}
    </tbody></table></div>}
  </div>;
}
