import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/queries";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Products — Admin" };

export default async function AdminProductsPage() {
  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  let error = "";
  try { products = await getAllProducts(); } catch { error = "The catalogue could not be loaded. Check the database connection."; }
  return <div>
    <div className="admin-page-heading"><div><p className="eyebrow">Merchandise</p><h1>Products</h1><p>{error || `${products.length} products total`}</p></div><Link href="/admin/products/new" className="button-primary">Add product</Link></div>
    {error ? <div className="admin-alert" role="alert">{error}</div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr>{["Product", "Category", "Variants", "Status", "Featured", "Action"].map((heading) => <th key={heading}>{heading}</th>)}</tr></thead><tbody>
      {products.length === 0 ? <tr><td colSpan={6} className="admin-empty">No products yet. Add a product with at least one variant.</td></tr> : products.map((product) => <tr key={product.id}><td><div className="font-medium text-white">{product.name}</div><div className="text-xs text-[#777067]">{product.sku || product.slug}</div></td><td className="text-[#aaa39a]">{product.category_name || "—"}</td><td className="text-[#aaa39a]">{product.variants?.length ?? 0}</td><td><Badge variant={product.is_active ? "green" : "red"}>{product.is_active ? "Published" : "Hidden"}</Badge></td><td>{product.is_featured ? <Badge variant="gold">Featured</Badge> : <span className="text-[#777067]">—</span>}</td><td><Link href={`/admin/products/${product.id}`} className="admin-row-link">Edit</Link></td></tr>)}
    </tbody></table></div>}
  </div>;
}
