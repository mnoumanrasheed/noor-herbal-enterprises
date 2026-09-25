export const DEFAULT_CONTACT_SETTINGS = {
  email: "noorherbalenterprises@gmail.com",
  phone: "+92 300 5599174",
  instagram: "https://www.instagram.com/noorherbalenterprices/",
} as const;

export type ContactSettings = {
  email: string;
  phone: string;
  instagram: string;
};

export const DEFAULT_HERO_SETTINGS = {
  eyebrow: "The Noor Herbal collection",
  title: "A considered ritual\nfor every day.",
  description: "Discover chutneys, pickles, oils, and herbal shampoos composed with care for kitchens, shelves, and daily routines.",
  ctaLabel: "Shop the collection",
  visualCategory: "The complete collection",
} as const;

export type HeroSettings = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  visualCategory: string;
};

export const DEFAULT_STOREFRONT_CONTENT = {
  homepageCopy: "Discover chutneys, pickles, oils, and shampoos composed with care for kitchens, shelves, and daily routines.",
  featuredContent: "A considered selection from the Noor Herbal collection.",
  footerContent: "Thoughtful pantry and personal care essentials, prepared for everyday rituals.",
} as const;

export type StorefrontContent = {
  homepageCopy: string;
  featuredContent: string;
  footerContent: string;
};
