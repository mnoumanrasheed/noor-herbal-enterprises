"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { adjustInventoryStock } from "@/app/admin/(dashboard)/inventory/actions";
import { formatPrice } from "@/types";
import type { InventoryItemRow } from "@/lib/queries";

interface InventoryTableProps {
  items: InventoryItemRow[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState<number>(0);
  const [editAlert, setEditAlert] = useState<number>(5);
  const [editReason, setEditReason] = useState("Restock / Manual Count");
  const [statusFeedback, setStatusFeedback] = useState<{ id: string; ok: boolean; msg: string } | null>(null);

  const [isPending, startTransition] = useTransition();

  const filteredItems = items.filter((item) => {
    // Status filter
    if (filter === "out" && item.quantity > 0) return false;
    if (filter === "low" && (item.quantity === 0 || item.quantity > item.low_stock_alert)) return false;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.product_name.toLowerCase().includes(q) ||
        item.variant_name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const lowStockCount = items.filter((i) => i.quantity > 0 && i.quantity <= i.low_stock_alert).length;
  const outOfStockCount = items.filter((i) => i.quantity === 0).length;

  function handleStartEdit(item: InventoryItemRow) {
    setEditingId(item.variant_id);
    setEditQty(item.quantity);
    setEditAlert(item.low_stock_alert);
    setEditReason("Stock count adjustment");
    setStatusFeedback(null);
  }

  function handleSave(variantId: string) {
    startTransition(async () => {
      const result = await adjustInventoryStock(variantId, editQty, editAlert, editReason);
      if (result.ok) {
        setStatusFeedback({ id: variantId, ok: true, msg: result.message || "Updated" });
        setEditingId(null);
      } else {
        setStatusFeedback({ id: variantId, ok: false, msg: result.error || "Failed" });
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Pills */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              filter === "all"
                ? "bg-[#c9a84c] text-[#0e0d0c]"
                : "border border-[#332f28] bg-[#181614] text-[#d8d2c7] hover:border-[#c9a84c]/50"
            }`}
          >
            All Items ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("low")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              filter === "low"
                ? "bg-amber-500 text-[#0e0d0c]"
                : "border border-[#332f28] bg-[#181614] text-amber-300 hover:border-amber-500/50"
            }`}
          >
            Low Stock ({lowStockCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("out")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              filter === "out"
                ? "bg-red-500 text-white"
                : "border border-[#332f28] bg-[#181614] text-red-300 hover:border-red-500/50"
            }`}
          >
            Out of Stock ({outOfStockCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search variant, SKU, product..."
            className="w-full sm:w-64 rounded-xl border border-[#38332a] bg-[#181614] px-4 py-2 text-xs text-[#f6f0e7] placeholder-[#6e675d] focus:border-[#c9a84c] focus:outline-none"
          />
        </div>
      </div>

      {statusFeedback && (
        <div
          className={`rounded-xl p-4 text-xs font-medium ${
            statusFeedback.ok
              ? "border border-green-500/40 bg-green-950/40 text-green-200"
              : "border border-red-500/40 bg-red-950/40 text-red-200"
          }`}
        >
          {statusFeedback.msg}
        </div>
      )}

      {/* Inventory Table */}
      <div className="rounded-3xl border border-[#2d2924] bg-[#141210] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#bfb7aa]">
            <thead className="border-b border-[#25221d] bg-[#181614] text-[11px] font-semibold uppercase tracking-wider text-[#8e8578]">
              <tr>
                <th className="p-4">SKU</th>
                <th className="p-4">Product & Variant</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-center">Available Stock</th>
                <th className="p-4 text-center">Alert Threshold</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#25221d]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-xs text-[#6e675d]">
                    No inventory records match your criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isEditing = editingId === item.variant_id;
                  const isOut = item.quantity <= 0;
                  const isLow = !isOut && item.quantity <= item.low_stock_alert;

                  return (
                    <tr key={item.variant_id} className="hover:bg-[#1a1715]/60 transition-colors">
                      {/* SKU */}
                      <td className="p-4 font-mono text-xs text-[#c9a84c] font-semibold">
                        {item.sku}
                      </td>

                      {/* Product Name */}
                      <td className="p-4">
                        <Link
                          href={`/admin/products/${item.product_id}/edit`}
                          className="font-medium text-white hover:text-[#c9a84c] transition-colors"
                        >
                          {item.product_name}
                        </Link>
                        <span className="block text-xs text-[#8e8578] mt-0.5">
                          {item.variant_name}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="p-4 text-xs text-[#a09a8f]">
                        {item.category_name}
                      </td>

                      {/* Price */}
                      <td className="p-4 font-display font-semibold text-white text-xs">
                        {formatPrice(item.price_paise)}
                      </td>

                      {/* Stock Quantity */}
                      <td className="p-4 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            min={0}
                            value={editQty}
                            onChange={(e) => setEditQty(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-20 rounded-lg border border-[#c9a84c] bg-[#1e1b15] px-2 py-1 text-center font-bold text-white text-xs"
                          />
                        ) : (
                          <span
                            className={`font-display font-bold text-sm ${
                              isOut ? "text-red-400" : isLow ? "text-amber-400" : "text-green-400"
                            }`}
                          >
                            {item.quantity} units
                          </span>
                        )}
                      </td>

                      {/* Low Stock Alert */}
                      <td className="p-4 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            min={0}
                            value={editAlert}
                            onChange={(e) => setEditAlert(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-16 rounded-lg border border-[#38332a] bg-[#1e1b15] px-2 py-1 text-center text-xs text-white"
                          />
                        ) : (
                          <span className="text-xs text-[#8e8578]">≤ {item.low_stock_alert}</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4 text-center">
                        {isOut ? (
                          <span className="rounded-full bg-red-950/80 border border-red-500/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-300">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="rounded-full bg-amber-950/80 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                            Low Stock
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-950/80 border border-green-500/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-300">
                            Available
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleSave(item.variant_id)}
                              disabled={isPending}
                              className="rounded-lg bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-500 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="rounded-lg border border-[#38332a] bg-[#1a1715] px-3 py-1 text-xs text-[#8e8578] hover:text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStartEdit(item)}
                            className="text-xs font-semibold text-[#c9a84c] hover:underline"
                          >
                            Adjust Stock
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
