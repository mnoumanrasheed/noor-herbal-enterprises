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

  // Auto-generate slug from product name (hidden field, still needed for URL routing)
  const autoSlug = useMemo(() => {
    const name = product?.name || "";
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }, [product?.name]);

  const serializedVariants = useMemo(() => JSON.stringify(variants.map((variant) => ({
    id: variant.id,
    name: variant.name,
    sku: variant.sku || `auto-${Date.now()}`,
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
    <form action={action} className="admin-form-card space-y-8">
      {product && <input type="hidden" name="id" value={product.id} />}
      {/* Slug auto-generated from name — hidden but still needed for routing */}
      <input type="hidden" name="slug" value={product?.slug || autoSlug} />
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="variants" value={serializedVariants} />

      <div className="admin-form-heading">
        <div>
          <p className="eyebrow text-xs uppercase tracking-[0.2em] text-[#c9a84c]">{product ? "Edit product" : "New product"}</p>
          <h2>{product ? product.name : "Create a product"}</h2>
        </div>
      </div>

      <div className="admin-form-grid grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Product Name */}
        <label>
          <span className="field-label">Product name *</span>
          <input
            name="name"
            className="field-input"
            defaultValue={product?.name}
            required
          />
        </label>

        {/* Category */}
        <label>
          <span className="field-label">Category *</span>
          <select
            name="categoryId"
            className="field-input"
            defaultValue={product?.category_id || ""}
            required
          >
            <option value="">Choose a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>

        {/* Short Description */}
        <label className="sm:col-span-2">
          <span className="field-label">Short Description</span>
          <input
            name="shortDesc"
            className="field-input"
            defaultValue={product?.short_desc || ""}
            placeholder="Brief one-line description shown on product cards"
          />
        </label>

        {/* Pure Ingredients */}
        <label className="sm:col-span-2">
          <span className="field-label">Pure Ingredients / Composition</span>
          <textarea
            name="ingredients"
            className="field-input min-h-24 resize-y"
            defaultValue={product?.ingredients || ""}
          />
        </label>

        {/* Sort Order + Toggles */}
        <label>
          <span className="field-label">Display Sort Order</span>
          <input
            name="sortOrder"
            type="number"
            min="0"
            className="field-input"
            defaultValue={product?.sort_order ?? 0}
          />
        </label>

        <div className="flex flex-wrap items-center gap-6 pt-6">
          <label className="admin-checkbox-label cursor-pointer">
            <input name="isActive" type="checkbox" defaultChecked={product?.is_active ?? true} className="accent-[#c9a84c]" />
            Published to Storefront
          </label>
          <label className="admin-checkbox-label cursor-pointer">
            <input name="isFeatured" type="checkbox" defaultChecked={product?.is_featured ?? false} className="accent-[#c9a84c]" />
            Featured Badge
          </label>
        </div>

        {/* SEO */}
        <label>
          <span className="field-label">Custom SEO Title</span>
          <input
            name="seoTitle"
            className="field-input"
            defaultValue={product?.seo_title || ""}
            placeholder="Custom title tag"
          />
        </label>
        <label>
          <span className="field-label">Custom SEO Meta Description</span>
          <input
            name="seoDescription"
            className="field-input"
            defaultValue={product?.seo_description || ""}
            placeholder="Custom meta description"
          />
        </label>
      </div>

      {/* Variants & Stock */}
      <div className="admin-section-rule">
        <p className="eyebrow text-xs uppercase tracking-wider text-[#c9a84c]">Variants and Stock</p>
        <p className="admin-field-hint mt-1">Configure pricing in PKR and stock quantities per variant.</p>
      </div>

      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div className="admin-variant-card space-y-4" key={variant.id || index}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <label>
                <span className="field-label text-[11px]">Variant Name *</span>
                <input
                  value={variant.name}
                  onChange={(e) => updateVariant(index, "name", e.target.value)}
                  className="field-input text-xs"
                  placeholder="e.g. 250g, 500ml"
                  required
                />
              </label>
              <label>
                <span className="field-label text-[11px]">Price (PKR) *</span>
                <input
                  value={variant.price}
                  onChange={(e) => updateVariant(index, "price", e.target.value)}
                  className="field-input text-xs"
                  type="number"
                  min="1"
                  step="1"
                  required
                />
              </label>
              <label>
                <span className="field-label text-[11px]">Compare Price (PKR)</span>
                <input
                  value={variant.comparePrice}
                  onChange={(e) => updateVariant(index, "comparePrice", e.target.value)}
                  className="field-input text-xs"
                  type="number"
                  min="0"
                  step="1"
                />
              </label>
              <label>
                <span className="field-label text-[11px]">Stock Quantity *</span>
                <input
                  value={variant.quantity}
                  onChange={(e) => updateVariant(index, "quantity", e.target.value)}
                  className="field-input text-xs"
                  type="number"
                  min="0"
                  required
                />
              </label>
              <label className="admin-checkbox-label cursor-pointer pt-6">
                <input
                  type="checkbox"
                  checked={variant.isActive}
                  onChange={(e) => updateVariant(index, "isActive", e.target.checked)}
                  className="accent-[#c9a84c]"
                />
                Variant Active
              </label>
            </div>
            {variants.length > 1 && (
              <button
                type="button"
                onClick={() => setVariants((cur) => cur.filter((_, i) => i !== index))}
                className="admin-remove-button text-xs"
              >
                Remove variant
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => setVariants((cur) => [...cur, { name: "", sku: "", price: "", comparePrice: "", weight: "", quantity: "0", lowStockAlert: "5", isActive: true }])}
          className="rounded-xl border border-[#e2e5ee] bg-white px-4 py-2 text-xs font-semibold text-[#374151] hover:border-[#c9a84c] hover:text-[#b8913f] transition-colors shadow-sm"
        >
          + Add Variant Option
        </button>
      </div>

      {/* Product Images */}
      <div className="admin-section-rule">
        <p className="eyebrow text-xs uppercase tracking-wider text-[#c9a84c] mb-3">Product Images</p>
        <AdminImageUpload images={images} onChange={setImages} multiple />
      </div>

      {/* Feedback */}
      {state.error && <p role="alert" className="admin-form-error">{state.error}</p>}
      {deleteError && <p role="alert" className="admin-form-error">{deleteError}</p>}
      {state.message && <p role="status" className="admin-form-success">{state.message}</p>}

      <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-[#e2e5ee]">
        {product && (
          <button
            type="button"
            onClick={removeProduct}
            className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
            disabled={pending || deleting}
          >
            {deleting ? "Deleting..." : "Delete product"}
          </button>
        )}
        <button
          className="button-primary px-8 py-3 text-xs uppercase tracking-wider font-semibold"
          disabled={pending || deleting}
        >
          {pending ? "Saving..." : product ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
