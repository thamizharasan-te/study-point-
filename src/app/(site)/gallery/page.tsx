import type { Metadata } from "next";
import { GalleryGrid } from "@/components/GalleryGrid";
import { PageHero } from "@/components/PageHero";
import { SampleTag } from "@/components/SampleTag";
import { getSiteData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos of learning, play and activities at Study Point nursery and classes in Point Pedro and Vathiry.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const { gallery } = await getSiteData();
  const hasSamples = gallery.some((g) => g.is_sample);
  return (
    <>
      <PageHero title="Our Learning Moments" subtitle="A look at everyday learning, play and fun at Study Point." />
      <section className="container-page py-10">
        {hasSamples && (
          <p className="mb-4 text-center"><SampleTag label="Placeholder photos — real photos coming soon" /></p>
        )}
        <GalleryGrid items={gallery} />
      </section>
    </>
  );
}
