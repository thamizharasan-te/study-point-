import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDict, localePath, type Lang } from "@/lib/i18n";
import type { GalleryItem } from "@/lib/types";
import { SmartImage } from "../SmartImage";

export function GalleryPreview({ items, lang }: { items: GalleryItem[]; lang: Lang }) {
  const t = getDict(lang);
  if (!items.length) return null;
  return (
    <section className="bg-yellow-100/70 py-8 sm:py-10" aria-labelledby="moments-title"><div className="container-page">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green">{t.preview.eyebrow}</p>
        <h2 id="moments-title" className="mt-1 text-2xl font-extrabold text-brand-navy-dark sm:text-3xl">{t.preview.title}</h2>
        <span className="rainbow-bar mt-2 block w-20" aria-hidden />
      </div>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {items.slice(0, 6).map((g, i) => (
          <li key={g.id} className={`rounded-xl bg-white p-1.5 pb-4 shadow-md transition-transform sm:hover:rotate-0 ${["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-1", "rotate-1"][i % 6]}`}>
            <SmartImage src={g.image_url} alt={g.alt} width={400} height={300} sizes="(min-width:1024px) 170px, (min-width:640px) 30vw, 46vw" className="aspect-[4/3] w-full rounded-lg object-cover object-[50%_35%]" />
          </li>
        ))}
      </ul>
      <div className="mt-6 text-center">
        <Link href={localePath(lang, "/gallery")} className="btn-green">{t.preview.viewGallery} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
    </div></section>
  );
}
