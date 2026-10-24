import { ChartColumn, Heart, ShieldCheck, Star, Users } from "lucide-react";
import { getDict, type Lang } from "@/lib/i18n";
import { slotImage } from "@/lib/images";
import type { SiteImages } from "@/lib/types";
import { SmartImage } from "../SmartImage";

const ICONS = [
  { icon: Users, bg: "bg-brand-green" },
  { icon: ShieldCheck, bg: "bg-brand-pink" },
  { icon: ChartColumn, bg: "bg-brand-navy" },
  { icon: Star, bg: "bg-amber-500" },
];

export function WhyStudyPoint({ images, lang }: { images: SiteImages; lang: Lang }) {
  const t = getDict(lang);
  const pic = slotImage(images, "why");
  return (
    <section className="reveal bg-white py-12" aria-labelledby="why-title">
      <div className="container-page grid items-center gap-8 lg:grid-cols-[1fr_2fr_1fr]">
        <SmartImage src={pic.src} alt={t.why.imageAlt} width={pic.width} height={pic.height} sizes="(min-width:1024px) 280px, 100vw" className="hidden aspect-[8/7] w-full rounded-3xl object-cover lg:block" />
        <div>
          <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-brand-navy">{t.why.kicker}</p>
          <h2 id="why-title" className="mt-1 text-center text-3xl font-extrabold text-brand-navy sm:text-4xl">{t.why.title}</h2>
          <p className="mx-auto mt-2 max-w-md text-center text-gray-700">{t.why.subtitle}</p>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            {t.why.items.map(({ title, text }, i) => {
              const { icon: Icon, bg } = ICONS[i];
              return (
                <li key={title} className="flex items-start gap-3">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white ${bg}`}><Icon className="h-6 w-6" aria-hidden /></span>
                  <span>
                    <span className="block font-bold text-brand-navy">{title}</span>
                    <span className="text-sm text-gray-600">{text}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <blockquote className="rounded-3xl bg-brand-cream p-6 text-center font-display text-xl text-brand-navy shadow-card">
          {t.why.quote}
          <Heart className="mx-auto mt-3 h-5 w-5 text-brand-pink" aria-hidden />
        </blockquote>
      </div>
    </section>
  );
}
