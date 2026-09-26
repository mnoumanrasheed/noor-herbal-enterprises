import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-[#f5f6fa]">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-[#e2e5ee] bg-white px-6 shadow-sm">
          <div />
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#6b7280] font-medium">
              {session.user.name ?? session.user.email}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c9a84c]/15 text-xs font-bold text-[#c9a84c] border border-[#c9a84c]/30">
              A
            </span>
          </div>
        </header>

        {/* Page content */}
        <main
          id="admin-main"
          className="flex-1 overflow-y-auto p-6 bg-[#f5f6fa]"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
