import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDict, localePath, type Lang } from "@/lib/i18n";
import { slotImage } from "@/lib/images";
import type { HeroContent, SiteImages } from "@/lib/types";
import { SmartImage } from "../SmartImage";

const BADGE_COLORS = ["text-brand-navy", "text-brand-green", "text-brand-green-dark", "text-brand-pink"];

/**
 * Home hero. On large screens the picture fills the right side and fades into
 * the white text area; on phones the text comes first, then the picture.
 */
export function Hero({ hero, images, lang }: { hero: HeroContent; images: SiteImages; lang: Lang }) {
  const t = getDict(lang);
  const pic = slotImage(images, "hero");
  return (
    <section className="relative flex flex-col overflow-hidden bg-white">
      <div className="container-page relative z-10">
        <div className="max-w-xl py-7 sm:py-10 lg:max-w-[52%] lg:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-navy sm:text-sm">{hero.eyebrow}</p>
          <h1 className="mt-3 text-[2.4rem] font-extrabold leading-[1.1] text-brand-navy-dark sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
            <span className="block">{hero.line1}</span>
            <span className="block">{hero.line2}</span>
            <span className="block">{hero.line3}</span>
          </h1>
          <span className="mt-4 block h-1 w-14 rounded-full bg-brand-pink" aria-hidden />
          <p className="mt-4 max-w-md text-base text-gray-700 sm:text-lg">{hero.subtitle}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href={localePath(lang, "/nursery")} className="btn-green !px-4 !text-sm sm:!text-sm">{t.hero.exploreEarly} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden /></Link>
            <Link href={localePath(lang, "/classes")} className="btn-pink !px-4 !text-sm sm:!text-sm">{t.hero.discoverClasses} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden /></Link>
          </div>
        </div>
      </div>

      <div className="relative mx-4 mb-8 overflow-hidden rounded-3xl shadow-card sm:mx-6 lg:absolute lg:inset-y-0 lg:right-0 lg:z-0 lg:m-0 lg:w-[58%] lg:rounded-none lg:shadow-none">
        <SmartImage
          src={pic.src}
          alt={t.hero.imageAlt}
          width={pic.width}
          height={pic.height}
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="aspect-[11/8] w-full object-cover object-[50%_35%] lg:aspect-auto lg:h-full"
        />
        <div className="absolute inset-y-0 left-0 hidden w-2/5 bg-gradient-to-r from-white to-transparent lg:block" aria-hidden />
        <p className="absolute right-3 top-3 -rotate-3 text-right font-script text-lg leading-snug sm:right-6 sm:top-5 sm:text-2xl" aria-hidden>
          {t.hero.badge.map((w, i) => <span key={w} className={`block ${BADGE_COLORS[i % BADGE_COLORS.length]}`}>{w}</span>)}
        </p>
      </div>
    </section>
  );
}
