import type { Metadata } from "next";
import { CartExperience } from "@/components/storefront/CartExperience";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return <CartExperience />;
}
