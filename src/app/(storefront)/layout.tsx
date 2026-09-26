import React from "react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { BrandLoader } from "@/components/storefront/BrandLoader";
import {
  getActiveCategories,
  getContactSettings,
  getStorefrontContent,
  getStoreSettings,
} from "@/lib/queries";
import type { Category } from "@/types";
import type { ContactSettings, StorefrontContent, StoreSettings } from "@/lib/site-settings";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: Category[] = [];
  let contactSettings: ContactSettings | undefined;
  let content: StorefrontContent | undefined;
  let storeSettings: StoreSettings | undefined;

  try {
    [categories, contactSettings, content, storeSettings] = await Promise.all([
      getActiveCategories(),
      getContactSettings(),
      getStorefrontContent(),
      getStoreSettings(),
    ]);
  } catch {
    categories = [];
    contactSettings = undefined;
    content = undefined;
    storeSettings = undefined;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#0e0d0c] text-[#f6f0e7] selection:bg-[#c9a84c] selection:text-[#0e0d0c]">
      <BrandLoader />
      <Header
        categories={categories.map((c) => ({ name: c.name, slug: c.slug }))}
        announcementText={storeSettings?.announcementBarText}
      />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer contactSettings={contactSettings} footerContent={content?.footerContent} />
    </div>
  );
}
