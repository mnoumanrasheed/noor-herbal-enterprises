export const CART_STORAGE_KEY = "noor-cart";

export type CartItem = {
  productId: string;
  productName: string;
  variantId: string;
  quantity: number;
};

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]") as unknown;
    if (!Array.isArray(raw)) return [];
    const merged = new Map<string, CartItem>();
    raw.forEach((item) => {
      if (!item || typeof item !== "object") return;
      const candidate = item as Partial<CartItem>;
      if (typeof candidate.productId !== "string" || typeof candidate.productName !== "string" || typeof candidate.variantId !== "string") return;
      const quantity = Math.max(1, Math.min(99, Number(candidate.quantity) || 1));
      const existing = merged.get(candidate.variantId);
      merged.set(candidate.variantId, { productId: candidate.productId, productName: candidate.productName, variantId: candidate.variantId, quantity: Math.min(99, quantity + (existing?.quantity ?? 0)) });
    });
    return [...merged.values()];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("noor-cart-updated"));
}
