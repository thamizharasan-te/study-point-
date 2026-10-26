import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDict, localePath, type Lang } from "@/lib/i18n";
import { slotImage } from "@/lib/images";
import type { Program, SiteImages } from "@/lib/types";
import { ProgramIcon } from "../ProgramIcon";
import { SmartImage } from "../SmartImage";

const NURSERY_TONES = ["bg-brand-pink-soft text-brand-pink", "bg-brand-green-soft text-brand-green", "bg-amber-100 text-amber-600", "bg-brand-navy-soft text-brand-navy"];
const CLASS_TONES = ["bg-brand-navy-soft text-brand-navy", "bg-brand-green-soft text-brand-green", "bg-brand-pink-soft text-brand-pink", "bg-amber-100 text-amber-600"];

function Skills({ items, tones }: { items: Program[]; tones: string[] }) {
  return (
    <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4">
      {items.map((p, i) => (
        <li key={p.title} className="flex flex-col items-center gap-2 text-center">
          <span className={`flex h-12 w-12 items-center justify-center rounded-full ${tones[i % tones.length]}`}>
            <ProgramIcon title={p.title} className="h-6 w-6" />
          </span>
          <span className="text-xs font-semibold text-brand-navy sm:text-[0.8rem]">{p.title}</span>
        </li>
      ))}
    </ul>
  );
}

/** The two big cards: Early Years (green) and Study Point Classes (blue). */
export function ProgramCards({ nursery, classes, images, lang }: { nursery: Program[]; classes: Program[]; images: SiteImages; lang: Lang }) {
  const t = getDict(lang);
  const nurseryPic = slotImage(images, "nursery");
  const classesPic = slotImage(images, "classes");
  return (
    <section className="container-page grid gap-5 py-8 sm:py-10 xl:grid-cols-2" aria-label={t.cards.aria}>
      <article className="rounded-3xl bg-gradient-to-br from-brand-green-soft to-white p-5 shadow-card ring-1 ring-brand-green/15 sm:p-7">
        <div className="grid items-center gap-4 sm:grid-cols-[1fr_11rem] lg:grid-cols-[1fr_16rem] xl:grid-cols-[1fr_10.5rem]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green">{t.cards.nursery.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-extrabold leading-tight text-brand-navy-dark sm:text-[1.75rem]">{t.cards.nursery.title}</h2>
            <p className="mt-2 font-bold text-brand-green-dark">{t.cards.nursery.age}</p>
            <p className="mt-2 text-sm text-gray-700">{t.cards.nursery.text}</p>
            <Link href={localePath(lang, "/nursery")} className="btn-green mt-4">{t.cards.nursery.learnMore}<span className="sr-only">{t.cards.nursery.about}</span> <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
          <div className="order-first sm:order-none">
            <SmartImage src={nurseryPic.src} alt={t.cards.nursery.imageAlt} width={nurseryPic.width} height={nurseryPic.height} sizes="(min-width:1024px) 230px, (min-width:640px) 30vw, 90vw" className="aspect-[8/7] w-full rounded-2xl object-cover object-[50%_35%]" />
          </div>
        </div>
        <Skills items={nursery} tones={NURSERY_TONES} />
      </article>

      <article className="rounded-3xl bg-gradient-to-br from-brand-navy-soft to-white p-5 shadow-card ring-1 ring-brand-navy/10 sm:p-7">
        <div className="grid items-center gap-4 sm:grid-cols-[1fr_11rem] lg:grid-cols-[1fr_16rem] xl:grid-cols-[1fr_10.5rem]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-navy">{t.cards.classes.eyebrow}</p>
            <h2 className="mt-2 whitespace-pre-line text-2xl font-extrabold leading-tight text-brand-navy-dark sm:text-[1.75rem]">{t.cards.classes.title.replace(/([.।]) /, "$1\n")}</h2>
            <p className="mt-2 font-bold text-brand-navy">{t.cards.classes.tagline}</p>
            <p className="mt-2 text-sm text-gray-700">{t.cards.classes.text}</p>
            <Link href={localePath(lang, "/classes")} className="btn-navy mt-4">{t.cards.classes.learnMore}<span className="sr-only">{t.cards.classes.about}</span> <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
          <div className="order-first sm:order-none">
            <SmartImage src={classesPic.src} alt={t.cards.classes.imageAlt} width={classesPic.width} height={classesPic.height} sizes="(min-width:1024px) 230px, (min-width:640px) 30vw, 90vw" className="aspect-[8/7] w-full rounded-2xl object-cover object-[50%_35%]" />
          </div>
        </div>
        <Skills items={classes} tones={CLASS_TONES} />
      </article>
    </section>
  );
}
