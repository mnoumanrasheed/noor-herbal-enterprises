import type { Metadata } from "next";
import { BrandStoryExperience } from "@/components/storefront/BrandStoryExperience";
import { getBrandStoryContent } from "@/lib/queries";
import {
  DEFAULT_BRAND_STORY_CONTENT,
  type BrandStoryContent,
} from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Discover the Noor Herbal Enterprises collection for the table and everyday care.",
};

export const revalidate = 60;

const defaultStory: BrandStoryContent = {
  ...DEFAULT_BRAND_STORY_CONTENT,
  openingImagePublicId: null,
  missionImagePublicId: null,
  visionImagePublicId: null,
};

export default async function AboutPage() {
  let story = defaultStory;

  try {
    story = await getBrandStoryContent();
  } catch {
    // The editorial page remains useful before database settings are connected.
  }

  return <BrandStoryExperience story={story} />;
}
