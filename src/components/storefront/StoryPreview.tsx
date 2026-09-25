import Image from "next/image";
import Link from "next/link";
import type { BrandStoryContent } from "@/lib/site-settings";

export function StoryPreview({ story }: { story: BrandStoryContent }) {
  const introduction = story.bodyOne.split(". ")[0] + ".";

  return (
    <section aria-labelledby="story-preview-heading" className="story-preview-section">
      <div className="site-shell story-preview-grid px-4 sm:px-6 lg:px-8">
        <div className="story-preview-copy">
          <p className="eyebrow">Our story</p>
          <h2 id="story-preview-heading" className="story-preview-title">{story.heading}</h2>
          <p>{introduction}</p>
          <Link href="/about" className="hero-secondary-action">Read our story <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="story-preview-art">
          <div className="story-preview-image">
            <Image src={story.openingImage} alt={story.openingImageAlt} fill sizes="(max-width: 767px) 90vw, 42vw" />
          </div>
          <span className="story-preview-index" aria-hidden="true">02 / 04</span>
        </div>
      </div>
    </section>
  );
}
