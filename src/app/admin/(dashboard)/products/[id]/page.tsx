import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCategories, getProductById } from "@/lib/queries";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Edit Product — Admin" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const [product, categories] = await Promise.all([getProductById(id), getAllCategories()]);
  if (!product) notFound();
  return <div className="admin-wide-page"><Link href="/admin/products" className="admin-back-link">← Products</Link><ProductForm product={product} categories={categories} /></div>;
}
