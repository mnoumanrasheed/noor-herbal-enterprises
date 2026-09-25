"use client";

import { useActionState, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminImageUpload, type AdminImage } from "./AdminImageUpload";
import { deleteProduct, saveProduct } from "@/app/admin/(dashboard)/products/actions";
import type { AdminActionState } from "@/app/admin/(dashboard)/categories/actions";
import type { Category, Product } from "@/types";

type EditableVariant = {
  id?: string;
  name: string;
  sku: string;
  price: string;
  comparePrice: string;
  weight: string;
  quantity: string;
  lowStockAlert: string;
  isActive: boolean;
};

const initialState: AdminActionState = { ok: false };

function initialVariants(product?: Product): EditableVariant[] {
  if (!product?.variants?.length) {
    return [{ name: "", sku: "", price: "", comparePrice: "", weight: "", quantity: "0", lowStockAlert: "5", isActive: true }];
  }
  return product.variants.map((variant) => ({
    id: variant.id,
    name: variant.name,
    sku: variant.sku,
    price: String(variant.price_paise / 100),
    comparePrice: variant.compare_price_paise ? String(variant.compare_price_paise / 100) : "",
    weight: variant.weight_grams ? String(variant.weight_grams) : "",
    quantity: String(variant.inventory?.quantity ?? 0),
    lowStockAlert: String(variant.inventory?.low_stock_alert ?? 5),
    isActive: variant.is_active,
  }));
}

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(saveProduct, initialState);
  const [deleting, startDeleting] = useTransition();
  const [deleteError, setDeleteError] = useState("");
  const [images, setImages] = useState<AdminImage[]>(
    product?.images?.map((image) => ({
      url: image.url,
      publicId: image.cloudinary_public_id,
      altText: image.alt_text || "",
      width: image.width,
      height: image.height,
      format: image.format,
    })) || [],
  );
  const [variants, setVariants] = useState<EditableVariant[]>(initialVariants(product));
  const serializedVariants = useMemo(() => JSON.stringify(variants.map((variant) => ({
    id: variant.id,
    name: variant.name,
    sku: variant.sku,
    pricePaise: Math.round(Number(variant.price || 0) * 100),
    comparePricePaise: variant.comparePrice ? Math.round(Number(variant.comparePrice) * 100) : null,
    weightGrams: variant.weight ? Number(variant.weight) : null,
    quantity: Number(variant.quantity || 0),
    lowStockAlert: Number(variant.lowStockAlert || 0),
    isActive: variant.isActive,
  }))), [variants]);

  function updateVariant(index: number, field: keyof EditableVariant, value: string | boolean) {
    setVariants((current) => current.map((variant, variantIndex) => (
      variantIndex === index ? { ...variant, [field]: value } : variant
    )));
  }

  function removeProduct() {
    if (!product || !window.confirm("Delete this product? This removes its variants, inventory, and catalogue images.")) return;
    setDeleteError("");
    startDeleting(async () => {
      const result = await deleteProduct(product.id);
      if (!result.ok) {
        setDeleteError(result.error || "The product could not be deleted.");
        return;
      }
      router.replace("/admin/products");
      router.refresh();
    });
  }

  return (
    <form action={action} className="admin-form-card">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="variants" value={serializedVariants} />
      <div className="admin-form-heading"><div><p className="eyebrow">{product ? "Edit product" : "New product"}</p><h2>{product ? product.name : "Create a product"}</h2></div></div>
      <div className="admin-form-grid">
        <label><span className="field-label">Product name</span><input name="name" className="field-input" defaultValue={product?.name} required /></label>
        <label><span className="field-label">Slug</span><input name="slug" className="field-input" defaultValue={product?.slug} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /></label>
        <label><span className="field-label">Product SKU</span><input name="sku" className="field-input" defaultValue={product?.sku || ""} placeholder="Optional parent SKU" /></label>
        <label><span className="field-label">Category</span><select name="categoryId" className="field-input" defaultValue={product?.category_id || ""} required><option value="">Choose a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label className="sm:col-span-2"><span className="field-label">Short description</span><input name="shortDesc" className="field-input" defaultValue={product?.short_desc || ""} /></label>
        <label className="sm:col-span-2"><span className="field-label">Description</span><textarea name="description" className="field-input min-h-28 resize-y" defaultValue={product?.description || ""} required /></label>
        <label><span className="field-label">Display order</span><input name="sortOrder" type="number" min="0" className="field-input" defaultValue={product?.sort_order ?? 0} /></label>
        <div className="flex flex-wrap items-center gap-5 pt-7"><label className="admin-checkbox-label"><input name="isActive" type="checkbox" defaultChecked={product?.is_active ?? false} /> Published</label><label className="admin-checkbox-label"><input name="isFeatured" type="checkbox" defaultChecked={product?.is_featured ?? false} /> Featured</label></div>
        <label className="sm:col-span-2"><span className="field-label">Ingredients / composition</span><textarea name="ingredients" className="field-input min-h-24 resize-y" defaultValue={product?.ingredients || ""} /></label>
        <label className="sm:col-span-2"><span className="field-label">Directions</span><textarea name="howToUse" className="field-input min-h-24 resize-y" defaultValue={product?.how_to_use || ""} /></label>
      </div>

      <div className="admin-section-rule"><p className="eyebrow">Variants and stock</p><p className="admin-field-hint">Prices are entered in Pakistani rupees. Inventory is updated safely per SKU.</p></div>
      <div className="space-y-3">
        {variants.map((variant, index) => <div className="admin-variant-card" key={variant.id || index}>
          <div className="admin-variant-grid">
            <label><span className="field-label">Variant name</span><input value={variant.name} onChange={(event) => updateVariant(index, "name", event.target.value)} className="field-input" placeholder="250g" /></label>
            <label><span className="field-label">SKU</span><input value={variant.sku} onChange={(event) => updateVariant(index, "sku", event.target.value)} className="field-input" /></label>
            <label><span className="field-label">Price (PKR)</span><input value={variant.price} onChange={(event) => updateVariant(index, "price", event.target.value)} className="field-input" type="number" min="0.01" step="0.01" /></label>
            <label><span className="field-label">Compare price</span><input value={variant.comparePrice} onChange={(event) => updateVariant(index, "comparePrice", event.target.value)} className="field-input" type="number" min="0" step="0.01" /></label>
            <label><span className="field-label">Weight (g)</span><input value={variant.weight} onChange={(event) => updateVariant(index, "weight", event.target.value)} className="field-input" type="number" min="1" /></label>
            <label><span className="field-label">Stock</span><input value={variant.quantity} onChange={(event) => updateVariant(index, "quantity", event.target.value)} className="field-input" type="number" min="0" /></label>
            <label><span className="field-label">Low stock alert</span><input value={variant.lowStockAlert} onChange={(event) => updateVariant(index, "lowStockAlert", event.target.value)} className="field-input" type="number" min="0" /></label>
            <label className="admin-checkbox-label pt-7"><input type="checkbox" checked={variant.isActive} onChange={(event) => updateVariant(index, "isActive", event.target.checked)} /> Available</label>
          </div>
          {variants.length > 1 && <button type="button" onClick={() => setVariants((current) => current.filter((_, variantIndex) => variantIndex !== index))} className="admin-remove-button mt-3">Remove variant</button>}
        </div>)}
        <button type="button" onClick={() => setVariants((current) => [...current, { name: "", sku: "", price: "", comparePrice: "", weight: "", quantity: "0", lowStockAlert: "5", isActive: true }])} className="admin-secondary-button">+ Add variant</button>
      </div>

      <AdminImageUpload images={images} onChange={setImages} multiple />
      {state.error && <p role="alert" className="admin-form-error">{state.error}</p>}
      {deleteError && <p role="alert" className="admin-form-error">{deleteError}</p>}
      {state.message && <p role="status" className="admin-form-success">{state.message}</p>}
      <div className="flex flex-wrap justify-end gap-3">
        {product ? <button type="button" onClick={removeProduct} className="admin-remove-button" disabled={pending || deleting}>{deleting ? "Deleting..." : "Delete product"}</button> : null}
        <button className="button-primary" disabled={pending || deleting}>{pending ? "Saving..." : product ? "Save product" : "Create product"}</button>
      </div>
    </form>
  );
}
