import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import { SmartImage } from "../SmartImage";

export function GalleryPreview({ items }: { items: GalleryItem[] }) {
  if (!items.length) return null;
  return (
    <section className="container-page py-8" aria-labelledby="moments-title">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id="moments-title" className="text-2xl font-extrabold text-brand-navy sm:text-3xl">Our Learning Moments</h2>
        <Link href="/gallery" className="btn-outline !min-h-9 !px-4 !py-1.5 !text-sm">View Gallery <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {items.slice(0, 5).map((g, i) => (
          <li key={g.id} className={i === 4 ? "hidden lg:block" : ""}>
            <SmartImage src={g.image_url} alt={g.alt} width={400} height={300} sizes="(min-width:1024px) 200px, 33vw" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-md" />
          </li>
        ))}
      </ul>
    </section>
  );
}
