"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { transitionOrder, updateOrderAdminDetails } from "@/app/admin/(dashboard)/orders/actions";
import type { Order, OrderStatus, PaymentStatus } from "@/types";

interface OrderDetailManagerProps {
  order: Order;
}

export function OrderDetailManager({ order }: OrderDetailManagerProps) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.payment_status);
  const [adminNote, setAdminNote] = useState<string>(order.admin_note || "");
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const [isPending, startTransition] = useTransition();

  function handleStatusChange(newStatus: OrderStatus) {
    startTransition(async () => {
      const res = await transitionOrder(order.id, newStatus);
      if (res.ok) {
        setStatus(newStatus);
        setFeedback({ ok: true, msg: res.message });
        router.refresh();
      } else {
        setFeedback({ ok: false, msg: res.error || "Failed to update status." });
      }
    });
  }

  function handleSaveDetails() {
    startTransition(async () => {
      const res = await updateOrderAdminDetails(order.id, paymentStatus, adminNote);
      if (res.ok) {
        setFeedback({ ok: true, msg: res.message });
        router.refresh();
      } else {
        setFeedback({ ok: false, msg: res.error || "Failed to update details." });
      }
    });
  }

  // Construct WhatsApp shortcut
  const cleanPhone = (order.customer_phone || "").replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello ${order.customer_name}! We are contacting you from Noor Herbal Enterprises regarding your Order #${order.order_number}.`
  )}`;

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={`rounded-2xl p-4 text-xs font-medium ${
            feedback.ok
              ? "border border-green-500/40 bg-green-950/40 text-green-200"
              : "border border-red-500/40 bg-red-950/40 text-red-200"
          }`}
        >
          {feedback.msg}
        </div>
      )}

      {/* Status Controls Card */}
      <div className="rounded-3xl border border-[#2d2924] bg-[#141210] p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#25221d] pb-5">
          <div>
            <h3 className="font-display text-lg font-bold text-white">Order Status & Fulfillment</h3>
            <p className="text-xs text-[#8e8578] mt-0.5">Current state: <strong className="uppercase text-[#c9a84c]">{status}</strong></p>
          </div>

          {/* WhatsApp Direct Chat */}
          {cleanPhone && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-2 text-xs font-semibold text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
            >
              <span>💬 Open WhatsApp Chat</span>
            </a>
          )}
        </div>

        {/* Workflow State Buttons */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a09a8f] mb-3">
            Change Fulfillment Status:
          </p>
          <div className="flex flex-wrap gap-2">
            {(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as OrderStatus[]).map((s) => {
              const isCurrent = status === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleStatusChange(s)}
                  disabled={isPending || isCurrent}
                  className={`rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                    isCurrent
                      ? "bg-[#c9a84c] text-[#0e0d0c] shadow-lg"
                      : s === "cancelled"
                      ? "border border-red-500/40 bg-[#1e1414] text-red-300 hover:bg-red-900/40"
                      : "border border-[#332f28] bg-[#181614] text-[#d8d2c7] hover:border-[#c9a84c]/50"
                  } disabled:opacity-50`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Status & Admin Notes */}
        <div className="border-t border-[#25221d] pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="paymentStatusSelect" className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#a09a8f] mb-2">
              Payment Status
            </label>
            <select
              id="paymentStatusSelect"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
              className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-xs text-white focus:border-[#c9a84c] focus:outline-none"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label htmlFor="adminNoteText" className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#a09a8f] mb-2">
              Internal Admin Notes
            </label>
            <textarea
              id="adminNoteText"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={2}
              placeholder="e.g. Courier tracking # TCS-99887766, verified on call"
              className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-2.5 text-xs text-white placeholder-[#6e675d] focus:border-[#c9a84c] focus:outline-none resize-y"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSaveDetails}
            disabled={isPending}
            className="button-primary text-xs uppercase tracking-wider px-6 py-2.5 font-semibold"
          >
            {isPending ? "Saving…" : "Save Payment & Notes"}
          </button>
        </div>
      </div>
    </div>
  );
}
