import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryById } from "@/lib/queries";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const metadata: Metadata = { title: "Edit Category — Admin" };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const category = await getCategoryById((await params).id);
  if (!category) notFound();
  return <div className="admin-narrow-page"><Link href="/admin/categories" className="admin-back-link">← Categories</Link><CategoryForm category={category} /></div>;
}
