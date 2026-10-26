import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDict, localePath, type Lang } from "@/lib/i18n";
import { slotImage } from "@/lib/images";
import type { HeroContent, SiteImages } from "@/lib/types";
import { SmartImage } from "../SmartImage";

const BADGE_COLORS = ["text-brand-navy", "text-brand-green", "text-brand-green-dark", "text-brand-pink"];

/**
 * Home hero, like the two cards below it: the photo fills the whole hero and the words sit on top of it over a
 * soft white fade (so they stay readable on any photo). On phones the photo is on top and fades into the words.
 */
export function Hero({ hero, images, lang }: { hero: HeroContent; images: SiteImages; lang: Lang }) {
  const t = getDict(lang);
  const pic = slotImage(images, "hero");
  return (
    <section className="relative flex flex-col overflow-hidden bg-white lg:min-h-[32rem]">
      <div className="relative aspect-[16/10] sm:aspect-[2/1] lg:absolute lg:inset-0 lg:aspect-auto">
        <SmartImage
          src={pic.src}
          alt={t.hero.imageAlt}
          width={pic.width}
          height={pic.height}
          priority
          sizes="100vw"
          className="h-full w-full object-cover object-[50%_30%]"
        />
        {/* fade into white: from the bottom on phones, from the left on large screens */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent lg:hidden" aria-hidden />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-white via-white/85 to-transparent lg:block lg:[background-size:68%_100%] lg:bg-no-repeat" aria-hidden />
        <p className="absolute right-3 top-3 -rotate-3 rounded-2xl bg-white/85 px-3 py-1.5 text-right font-script text-lg leading-snug shadow-md sm:right-6 sm:top-5 sm:text-2xl" aria-hidden>
          {t.hero.badge.map((w, i) => <span key={w} className={`block ${BADGE_COLORS[i % BADGE_COLORS.length]}`}>{w}</span>)}
        </p>
      </div>

      <div className="container-page relative z-10 -mt-12 sm:-mt-16 lg:mt-0 lg:flex lg:min-h-[32rem] lg:items-center">
        <div className="max-w-xl pb-8 pt-2 sm:pb-10 lg:max-w-[50%] lg:py-14">
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
    </section>
  );
}
