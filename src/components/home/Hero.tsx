import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDict, localePath, type Lang } from "@/lib/i18n";
import { slotImage } from "@/lib/images";
import type { HeroContent, SiteImages } from "@/lib/types";
import { AbcBlock, Balloon, Cloud, Heart, Pencil, Star, Sun, Wave } from "../Decor";
import { SmartImage } from "../SmartImage";

const BADGE_COLORS = ["text-sky-700", "text-brand-green", "text-amber-700", "text-brand-pink"];

/** Home hero: a cheerful sky of sun, clouds, balloons and letter blocks around the heading and a framed photo. */
export function Hero({ hero, images, lang }: { hero: HeroContent; images: SiteImages; lang: Lang }) {
  const t = getDict(lang);
  const pic = slotImage(images, "hero");
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-yellow-50 to-pink-100">
      {/* decorations (behind the content) */}
      <Sun className="bob-slow pointer-events-none absolute -left-4 top-3 h-16 w-16 sm:left-[44%] sm:top-4 sm:h-20 sm:w-20" />
      <Cloud className="bob pointer-events-none absolute right-[8%] top-3 hidden h-12 w-20 sm:block" />
      <Cloud className="bob-slow pointer-events-none absolute left-[33%] top-3 hidden h-10 w-16 lg:block" />
      <Star className="bob pointer-events-none absolute left-[46%] top-[38%] hidden h-9 w-9 lg:block" />
      <Star color="#ff8fab" className="bob-slow pointer-events-none absolute bottom-24 left-[8%] hidden h-7 w-7 sm:block" />
      <Heart className="bob pointer-events-none absolute bottom-32 left-[47%] hidden h-8 w-8 lg:block" />
      <AbcBlock letter="A" color="#4fc3f7" className="bob-slow pointer-events-none absolute bottom-16 left-[2%] hidden h-14 w-14 -rotate-12 sm:block" />
      <AbcBlock letter="B" color="#ff6f91" className="bob pointer-events-none absolute bottom-6 left-[4%] hidden h-12 w-12 rotate-6 sm:block" />
      <Pencil className="bob-slow pointer-events-none absolute bottom-24 right-[3%] hidden h-8 w-28 -rotate-45 lg:block" />
      <Balloon className="bob pointer-events-none absolute -right-2 bottom-20 hidden h-24 w-12 sm:block lg:right-[1%] lg:top-[22%] lg:bottom-auto" />

      <div className="container-page relative z-10 grid items-center gap-6 pb-14 pt-6 sm:gap-8 sm:pb-16 lg:grid-cols-[1.05fr_1fr] lg:pb-20 lg:pt-10">
        <div className="pl-12 sm:pl-0 lg:pt-4">
          <p className="inline-block rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-brand-navy shadow-sm sm:text-sm">{hero.eyebrow}</p>
          <h1 className="mt-3 text-[2.6rem] font-extrabold leading-[1.05] sm:text-6xl lg:text-[4rem]">
            <span className="block text-brand-navy">{hero.line1}</span>
            <span className="block text-brand-pink">{hero.line2}</span>
            <span className="block text-brand-green">{hero.line3}</span>
          </h1>
          <span className="rainbow-bar mt-4 block w-24" aria-hidden />
          <p className="mt-4 max-w-md text-base text-gray-700 sm:text-lg">{hero.subtitle}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href={localePath(lang, "/nursery")} className="btn-green !px-4 !text-sm sm:!text-sm">{t.hero.exploreEarly} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden /></Link>
            <Link href={localePath(lang, "/classes")} className="btn-pink !px-4 !text-sm sm:!text-sm">{t.hero.discoverClasses} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden /></Link>
          </div>
        </div>

        <div className="relative lg:rotate-1">
          <div className="overflow-hidden rounded-[2rem] border-[6px] border-white shadow-card sm:rounded-[2.5rem] sm:border-8">
            <SmartImage
              src={pic.src}
              alt={t.hero.imageAlt}
              width={pic.width}
              height={pic.height}
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="aspect-[11/8] w-full object-cover object-[50%_35%]"
            />
          </div>
          <p className="absolute -top-3 right-3 -rotate-3 rounded-2xl bg-white px-3 py-1.5 text-right font-script text-lg leading-snug shadow-md sm:right-6 sm:text-2xl" aria-hidden>
            {t.hero.badge.map((w, i) => <span key={w} className={`block ${BADGE_COLORS[i % BADGE_COLORS.length]}`}>{w}</span>)}
          </p>
        </div>
      </div>
      <Wave className="absolute inset-x-0 bottom-0" />
    </section>
  );
}
