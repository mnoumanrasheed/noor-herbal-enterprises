import type { Metadata } from "next";
import { InventoryTable } from "@/components/admin/InventoryTable";
import { getInventoryOverview, type InventoryItemRow } from "@/lib/queries";

export const metadata: Metadata = { title: "Inventory & Stock Management — Admin" };

export default async function AdminInventoryPage() {
  let inventory: InventoryItemRow[] = [];
  let error = "";

  try {
    inventory = await getInventoryOverview();
  } catch {
    error = "Could not load inventory records from the database.";
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#111827] mb-1">
          Inventory & Stock Levels
        </h1>
        <p className="text-sm text-[#6b7280]">
          Track real-time stock quantities across all product variants and update replenishment counts.
        </p>
      </div>

      {error ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <InventoryTable items={inventory} />
      )}
    </div>
  );
}
