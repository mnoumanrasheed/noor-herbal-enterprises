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
  eyebrow: "Real products. Rooted in care.",
  title: "For the table.\nFor everyday care.",
  description: "Meet Noor Herbal's real pantry and personal-care collection, photographed for the shelf, the table, and the daily reset.",
  ctaLabel: "Explore the collection",
  visualCategory: "Pickles + shampoo preview",
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

export const DEFAULT_BRAND_STORY_CONTENT = {
  heading: "Everyday moments deserve a little more care.",
  bodyOne: "Noor Herbal Enterprises brings together two parts of daily life: the flavours we share and the care we give ourselves. From chutneys and pickles at the table to hair oil and shampoo in our personal care range, our collection is made for familiar routines and meaningful moments.",
  bodyTwo: "We believe a good product should feel considered from the moment you discover it. That belief shapes how we present our collection: with clarity, warmth, and attention to detail. Whether you are choosing something for a meal or for your daily care routine, we want the experience to feel simple, personal, and worth returning to.",
  mission: "To bring thoughtfully presented food and personal care products into everyday life, while making it easy for customers to discover, choose, and order with confidence.",
  vision: "To build Noor Herbal Enterprises into a trusted name for everyday favourites—known for a distinctive collection, a welcoming shopping experience, and lasting relationships with customers.",
  openingImage: "/images/products/noor-herbal-hair-oil.jpeg",
  openingImageAlt: "Noor Herbal hair oil bottle",
  missionImage: "/images/products/aloo-bukharay-ki-chutney.jpeg",
  missionImageAlt: "Noor Herbal Aloo Bukhara chutney jar",
  visionImage: "/images/products/noor-herbal-shampoo-source.jpeg",
  visionImageAlt: "Noor Herbal shampoo bottle",
} as const;

export type BrandStoryContent = {
  heading: string;
  bodyOne: string;
  bodyTwo: string;
  mission: string;
  vision: string;
  openingImage: string;
  openingImageAlt: string;
  openingImagePublicId: string | null;
  missionImage: string;
  missionImageAlt: string;
  missionImagePublicId: string | null;
  visionImage: string;
  visionImageAlt: string;
  visionImagePublicId: string | null;
};
