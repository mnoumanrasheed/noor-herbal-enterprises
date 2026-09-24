import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Orders — Admin" };

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white mb-1">Orders</h1>
      <p className="text-sm text-[#a09a8f] mb-8">
        Customer orders will appear here once the storefront checkout is live.
      </p>

      <div className="rounded-[12px] border border-dashed border-[#2e2e2e] bg-[#1c1c1c] p-16 text-center">
        <p className="text-[#6b6560] font-medium">No orders yet.</p>
        <p className="mt-2 text-xs text-[#4a4a4a]">
          Orders will be listed here as customers purchase products.
        </p>
      </div>
    </div>
  );
}
