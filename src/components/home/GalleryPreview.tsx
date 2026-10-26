import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDict, localePath, type Lang } from "@/lib/i18n";
import type { GalleryItem } from "@/lib/types";
import { SmartImage } from "../SmartImage";

export function GalleryPreview({ items, lang }: { items: GalleryItem[]; lang: Lang }) {
  const t = getDict(lang);
  if (!items.length) return null;
  return (
    <section className="container-page py-8" aria-labelledby="moments-title">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green">{t.preview.eyebrow}</p>
          <h2 id="moments-title" className="mt-1 text-2xl font-extrabold text-brand-navy-dark sm:text-3xl">{t.preview.title}</h2>
          <span className="mt-2 block h-1 w-12 rounded-full bg-brand-green" aria-hidden />
        </div>
        <Link href={localePath(lang, "/gallery")} className="btn-outline !min-h-10 !px-5 !py-2 !text-sm">{t.preview.viewGallery} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {items.slice(0, 5).map((g, i) => (
          <li key={g.id} className={i === 4 ? "hidden lg:block" : ""}>
            <SmartImage src={g.image_url} alt={g.alt} width={400} height={300} sizes="(min-width:1024px) 200px, 33vw" className="aspect-[4/3] w-full rounded-2xl object-cover object-[50%_35%] shadow-md" />
          </li>
        ))}
      </ul>
    </section>
  );
}
