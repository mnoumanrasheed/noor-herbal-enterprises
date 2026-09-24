import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth guard — belt-and-suspenders alongside middleware
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-[#111111]">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-[#2e2e2e] bg-[#0f0f0f] px-6">
          <div />
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#a09a8f]">
              {session.user.name ?? session.user.email}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c9a84c]/20 text-xs font-bold text-[#c9a84c]">
              A
            </span>
          </div>
        </header>

        {/* Page content */}
        <main
          id="admin-main"
          className="flex-1 overflow-y-auto p-6"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
