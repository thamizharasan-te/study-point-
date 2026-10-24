import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDict, localePath, type Lang } from "@/lib/i18n";
import { slotImage } from "@/lib/images";
import type { Program, SiteImages } from "@/lib/types";
import { ProgramIcon } from "../ProgramIcon";
import { SmartImage } from "../SmartImage";

/** The two big cards: Nursery (pink) and Study Point Classes (blue). */
export function ProgramCards({ nursery, classes, images, lang }: { nursery: Program[]; classes: Program[]; images: SiteImages; lang: Lang }) {
  const t = getDict(lang);
  const nurseryPic = slotImage(images, "nursery");
  const classesPic = slotImage(images, "classes");
  return (
    <section className="container-page reveal grid gap-5 py-10 lg:grid-cols-2" aria-label={t.cards.aria}>
      <article className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-pink-soft to-amber-50 shadow-card">
        <div className="grid items-center gap-4 p-5 sm:grid-cols-5 sm:gap-3 sm:p-7">
          <div className="sm:col-span-3">
            <h2 className="text-4xl font-extrabold text-brand-pink sm:text-5xl">{t.cards.nursery.title}</h2>
            <p className="font-display text-2xl font-bold text-brand-pink">{t.cards.nursery.age}</p>
            <p className="mt-2 text-sm font-semibold text-brand-navy sm:text-base">{t.cards.nursery.tagline}</p>
            <p className="mt-2 text-sm text-gray-700">{t.cards.nursery.text}</p>
            <Link href={localePath(lang, "/nursery")} className="btn-pink mt-4">{t.cards.nursery.learnMore}<span className="sr-only">{t.cards.nursery.about}</span> <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
          <div className="order-first sm:order-none sm:col-span-2">
            <SmartImage src={nurseryPic.src} alt={t.cards.nursery.imageAlt} width={nurseryPic.width} height={nurseryPic.height} sizes="(min-width:1024px) 220px, 40vw" className="aspect-[3/2] w-full rounded-2xl object-cover sm:aspect-[8/7]" />
          </div>
        </div>
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-3 bg-white/70 px-3 py-4">
          {nursery.map((p) => (
            <li key={p.title} className="flex w-24 flex-col items-center gap-1 text-center text-xs font-semibold text-brand-navy">
              <ProgramIcon title={p.title} className="h-8 w-8 text-brand-pink" />
              {p.title}
            </li>
          ))}
        </ul>
      </article>

      <article className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy-soft to-white shadow-card">
        <div className="grid items-center gap-4 p-5 sm:grid-cols-5 sm:gap-3 sm:p-7">
          <div className="sm:col-span-3">
            <h2 className="text-3xl font-extrabold text-brand-navy sm:text-4xl">{t.cards.classes.title}</h2>
            <p className="mt-1 font-display text-lg font-bold text-brand-green sm:text-xl">{t.cards.classes.tagline}</p>
            <p className="mt-2 text-sm text-gray-700">{t.cards.classes.text}</p>
            <Link href={localePath(lang, "/classes")} className="btn-navy mt-4">{t.cards.classes.learnMore}<span className="sr-only">{t.cards.classes.about}</span> <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
          <div className="order-first sm:order-none sm:col-span-2">
            <SmartImage src={classesPic.src} alt={t.cards.classes.imageAlt} width={classesPic.width} height={classesPic.height} sizes="(min-width:1024px) 220px, 40vw" className="aspect-[3/2] w-full rounded-2xl object-cover sm:aspect-[8/7]" />
          </div>
        </div>
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-3 bg-white/70 px-3 py-4">
          {classes.map((p) => (
            <li key={p.title} className="flex w-24 flex-col items-center gap-1 text-center text-xs font-semibold text-brand-navy">
              <ProgramIcon title={p.title} className="h-8 w-8 text-brand-navy" />
              {p.title}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
