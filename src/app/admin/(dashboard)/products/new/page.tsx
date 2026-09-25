import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/queries";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "New Product — Admin" };

export default async function NewProductPage() {
  const categories = await getAllCategories();
  return <div className="admin-wide-page"><Link href="/admin/products" className="admin-back-link">← Products</Link><ProductForm categories={categories} /></div>;
}
