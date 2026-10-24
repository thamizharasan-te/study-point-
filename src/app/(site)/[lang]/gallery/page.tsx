import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GalleryGrid } from "@/components/GalleryGrid";
import { PageHero } from "@/components/PageHero";
import { SampleTag } from "@/components/SampleTag";
import { getSiteData } from "@/lib/data";
import { getDict, isLang } from "@/lib/i18n";
import { pageMeta } from "@/lib/i18n/meta";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDict(lang).pages.gallery;
  return pageMeta(lang, "/gallery", t.metaTitle, t.metaDescription);
}

export default async function GalleryPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const p = getDict(lang).pages.gallery;
  const { gallery } = await getSiteData();
  const hasSamples = gallery.some((g) => g.is_sample);
  return (
    <>
      <PageHero title={p.title} subtitle={p.subtitle} />
      <section className="container-page py-8 sm:py-10">
        {hasSamples && (
          <p className="mb-4 text-center"><SampleTag label={p.sample} /></p>
        )}
        <GalleryGrid items={gallery} />
      </section>
    </>
  );
}
