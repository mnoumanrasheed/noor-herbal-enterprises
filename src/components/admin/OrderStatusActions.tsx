"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { transitionOrder } from "@/app/admin/(dashboard)/orders/actions";
import type { OrderStatus } from "@/types";

const NEXT_ACTIONS: Partial<Record<OrderStatus, Array<{ status: "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"; label: string }>>> = {
  pending: [{ status: "confirmed", label: "Confirm" }, { status: "cancelled", label: "Cancel" }],
  confirmed: [{ status: "processing", label: "Start fulfilment" }, { status: "cancelled", label: "Cancel" }],
  processing: [{ status: "shipped", label: "Mark shipped" }, { status: "cancelled", label: "Cancel" }],
  shipped: [{ status: "delivered", label: "Mark delivered" }, { status: "cancelled", label: "Cancel" }],
};

export function OrderStatusActions({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const router = useRouter();
  const actions = NEXT_ACTIONS[status] ?? [];
  if (!actions.length) return <span className="text-xs text-[#777067]">No further actions</span>;
  return <div className="flex flex-wrap gap-2">{actions.map((action) => <button key={action.status} type="button" disabled={pending} onClick={() => startTransition(async () => { const result = await transitionOrder(orderId, action.status); setMessage(result.error || result.message); if (result.ok) router.refresh(); })} className={action.status === "cancelled" ? "admin-remove-button" : "admin-secondary-button"}>{pending ? "Saving…" : action.label}</button>)}{message && <p className="w-full text-xs text-[#aaa39a]">{message}</p>}</div>;
}
