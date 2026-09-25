import type { Metadata } from "next";
import Link from "next/link";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const metadata: Metadata = { title: "New Category — Admin" };

export default function NewCategoryPage() {
  return <div className="admin-narrow-page"><Link href="/admin/categories" className="admin-back-link">← Categories</Link><CategoryForm /></div>;
}
