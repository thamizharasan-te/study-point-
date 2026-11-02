import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDict, localePath, type Lang } from "@/lib/i18n";
import type { GalleryItem } from "@/lib/types";
import { GalleryShowcase } from "./GalleryShowcase";

/** Newest photos first: the admin adds new photos at the end of the list. */
const newestFirst = (items: GalleryItem[]) => [...items].sort((a, b) => b.sort_order - a.sort_order);

/** How many photos are considered for the shuffle (keeps the page light when the gallery grows large). */
const POOL = 40;

export function GalleryPreview({ items, lang }: { items: GalleryItem[]; lang: Lang }) {
  const t = getDict(lang);
  if (!items.length) return null;
  const pool = newestFirst(items).slice(0, POOL).map((g) => ({ id: g.id, image_url: g.image_url, alt: g.alt }));
  return (
    <section className="container-page py-8" aria-labelledby="moments-title">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green">{t.preview.eyebrow}</p>
        <h2 id="moments-title" className="mt-1 text-2xl font-extrabold text-brand-navy-dark sm:text-3xl">{t.preview.title}</h2>
        <span className="mt-2 block h-1 w-12 rounded-full bg-brand-green" aria-hidden />
      </div>
      <GalleryShowcase pool={pool} />
      <div className="mt-6 text-center">
        <Link href={localePath(lang, "/gallery")} className="btn-green">{t.preview.viewGallery} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
    </section>
  );
}
