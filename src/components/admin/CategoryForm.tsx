"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminImageUpload, type AdminImage } from "./AdminImageUpload";
import { deleteCategory, saveCategory, type AdminActionState } from "@/app/admin/(dashboard)/categories/actions";
import type { Category } from "@/types";

const initialState: AdminActionState = { ok: false };

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(saveCategory, initialState);
  const [deleting, startDeleting] = useTransition();
  const [deleteError, setDeleteError] = useState("");
  const [images, setImages] = useState<AdminImage[]>(
    category?.image_url
      ? [{ url: category.image_url, publicId: category.image_public_id, altText: category.image_alt || "" }]
      : [],
  );

  function removeCategory() {
    if (!category || !window.confirm(`Delete ${category.name}? Categories with products cannot be deleted.`)) return;
    setDeleteError("");
    startDeleting(async () => {
      const result = await deleteCategory(category.id);
      if (!result.ok) {
        setDeleteError(result.error || "The category could not be deleted.");
        return;
      }
      router.replace("/admin/categories");
      router.refresh();
    });
  }

  return (
    <form action={action} className="admin-form-card">
      {category && <input type="hidden" name="id" value={category.id} />}
      <div className="admin-form-heading"><div><p className="eyebrow">{category ? "Edit collection" : "New collection"}</p><h2>{category ? category.name : "Create a category"}</h2></div></div>
      <div className="admin-form-grid">
        <label><span className="field-label">Name</span><input name="name" className="field-input" defaultValue={category?.name} required /></label>
        <label><span className="field-label">Slug</span><input name="slug" className="field-input" defaultValue={category?.slug} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /><span className="admin-field-hint">Lowercase letters and hyphens.</span></label>
        <label className="sm:col-span-2"><span className="field-label">Description</span><textarea name="description" className="field-input min-h-24 resize-y" defaultValue={category?.description || ""} /></label>
        <label><span className="field-label">Display order</span><input name="sortOrder" type="number" min="0" className="field-input" defaultValue={category?.sort_order ?? 0} /></label>
        <label className="admin-checkbox-label"><input name="isActive" type="checkbox" defaultChecked={category?.is_active ?? true} /> Visible on storefront</label>
      </div>
      <AdminImageUpload images={images} onChange={setImages} />
      <input type="hidden" name="imageUrl" value={images[0]?.url || ""} />
      <input type="hidden" name="imagePublicId" value={images[0]?.publicId || ""} />
      <input type="hidden" name="imageAlt" value={images[0]?.altText || ""} />
      {state.error && <p role="alert" className="admin-form-error">{state.error}</p>}
      {deleteError && <p role="alert" className="admin-form-error">{deleteError}</p>}
      {state.message && <p role="status" className="admin-form-success">{state.message}</p>}
      <div className="flex flex-wrap justify-end gap-3">
        {category ? <button type="button" onClick={removeCategory} className="admin-remove-button" disabled={pending || deleting}>{deleting ? "Deleting..." : "Delete category"}</button> : null}
        <button className="button-primary" disabled={pending || deleting}>{pending ? "Saving..." : category ? "Save category" : "Create category"}</button>
      </div>
    </form>
  );
}
