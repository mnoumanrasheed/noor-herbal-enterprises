"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {error && (
        <div
          role="alert"
          className="rounded-[8px] border border-[#c0392b]/40 bg-[#c0392b]/10 px-4 py-3 text-sm text-[#e57373]"
        >
          {error}
        </div>
      )}

      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        required
        className="bg-[#0f0f0f] border-[#4a4a4a] text-white placeholder:text-[#6b6560] focus:border-[#c9a84c]"
      />

      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="bg-[#0f0f0f] border-[#4a4a4a] text-white placeholder:text-[#6b6560] focus:border-[#c9a84c]"
      />

      <Button
        type="submit"
        variant="primary"
        size="md"
        loading={pending}
        className="w-full"
      >
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
