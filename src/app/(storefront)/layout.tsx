import React from "react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { getContactSettings, getStorefrontContent } from "@/lib/queries";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let contactSettings;
  let content;
  try {
    [contactSettings, content] = await Promise.all([getContactSettings(), getStorefrontContent()]);
  } catch {
    contactSettings = undefined;
    content = undefined;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer contactSettings={contactSettings} footerContent={content?.footerContent} />
    </div>
  );
}
