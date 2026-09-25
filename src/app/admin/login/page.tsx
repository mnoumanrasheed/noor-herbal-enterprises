import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#0f0f0f] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex rounded-md bg-white p-1.5"><Logo size={38} /></div>
          <p className="mt-1 text-xs tracking-widest uppercase text-[#6b6560]">
            Admin Portal
          </p>
        </div>

        <div className="rounded-[12px] border border-[#2e2e2e] bg-[#1c1c1c] p-8">
          <h1 className="mb-6 text-xl font-semibold text-white">Sign in</h1>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
