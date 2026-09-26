import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f5f6fa] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex rounded-xl bg-white shadow-sm border border-[#e2e5ee] p-2">
            <Logo size={38} />
          </div>
          <p className="mt-2 text-xs tracking-widest uppercase text-[#9ca3af] font-semibold">
            Admin Portal
          </p>
        </div>

        <div className="rounded-2xl border border-[#e2e5ee] bg-white p-8 shadow-md">
          <h1 className="mb-6 text-xl font-bold text-[#111827]">Sign in</h1>
          <LoginForm />
        </div>

        <p className="mt-4 text-center text-xs text-[#9ca3af]">
          Noor Herbal Enterprises · Admin Access Only
        </p>
      </div>
    </main>
  );
}
