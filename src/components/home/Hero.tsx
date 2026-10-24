import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDict, localePath, type Lang } from "@/lib/i18n";
import { slotImage } from "@/lib/images";
import type { HeroContent, SiteImages } from "@/lib/types";
import { LeafSprig, Wave } from "../Decor";
import { SmartImage } from "../SmartImage";

/** Home hero. (The "Watch Our Story" video button is intentionally omitted until a video exists.) */
export function Hero({ hero, images, lang }: { hero: HeroContent; images: SiteImages; lang: Lang }) {
  const t = getDict(lang);
  const pic = slotImage(images, "hero");
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-green-soft via-white to-brand-pink-soft">
      <LeafSprig className="pointer-events-none absolute -left-20 bottom-6 hidden h-72 w-32 xl:block" />
      <LeafSprig flip className="pointer-events-none absolute -right-6 top-0 hidden h-56 w-24 lg:block" />
      <div className="container-page relative grid items-center gap-6 pb-12 pt-8 sm:pb-16 sm:pt-12 lg:grid-cols-2 lg:gap-10 lg:pb-20 lg:pt-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-navy sm:text-sm">{hero.eyebrow}</p>
          <h1 className={`mt-3 text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:leading-[1.05] ${lang === "ta" ? "lg:text-6xl" : "lg:text-7xl"}`}>
            <span className="block text-brand-navy-dark">{hero.line1}</span>
            <span className="block text-brand-green">{hero.line2}</span>
            <span className="block text-brand-pink">{hero.line3}</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-gray-700 sm:text-lg">{hero.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={localePath(lang, "/nursery")} className="btn-pink">{t.hero.exploreEarly} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <Link href={localePath(lang, "/classes")} className="btn-green">{t.hero.discoverClasses} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] border-4 border-white shadow-card">
            <SmartImage
              src={pic.src}
              alt={t.hero.imageAlt}
              width={pic.width}
              height={pic.height}
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="aspect-[11/8] w-full object-cover"
            />
          </div>
          <p className="absolute -top-2 right-2 rotate-6 rounded-3xl bg-white/90 px-4 py-2 text-center font-script text-lg leading-tight text-brand-green shadow-md sm:right-4 sm:text-2xl">
            {t.hero.badge.map((w, i) => <span key={w}>{i > 0 && <br />}{w}</span>)}
          </p>
        </div>
      </div>
      <Wave className="absolute inset-x-0 bottom-0" />
    </section>
  );
}
