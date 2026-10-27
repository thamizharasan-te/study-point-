import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDict, localePath, type Lang } from "@/lib/i18n";
import { slotImage } from "@/lib/images";
import type { Program, SiteImages } from "@/lib/types";
import { ProgramIcon } from "../ProgramIcon";
import { SmartImage } from "../SmartImage";

const NURSERY_TONES = ["bg-pink-100 text-brand-pink", "bg-green-100 text-brand-green", "bg-orange-100 text-orange-500", "bg-sky-100 text-sky-600"];
const CLASS_TONES = ["bg-sky-100 text-sky-600", "bg-blue-100 text-blue-700", "bg-pink-100 text-brand-pink", "bg-sky-100 text-sky-700"];

function Skills({ items, tones }: { items: Program[]; tones: string[] }) {
  return (
    <ul className="relative grid grid-cols-2 gap-x-3 gap-y-4 bg-white/70 px-4 py-4 sm:grid-cols-4 sm:px-7">
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

/**
 * The two big cards as in the design: the photo fills the card and the words sit on it, over a soft fade of
 * the card colour (so they stay easy to read on any photo). On phones the photo is on top and fades into the words.
 */
function Card({ tone, img, alt, children, skills }: { tone: "green" | "blue"; img: { src: string; width: number; height: number }; alt: string; children: React.ReactNode; skills: React.ReactNode }) {
  const bg = tone === "green" ? "bg-brand-green-soft" : "bg-brand-navy-soft";
  const c = tone === "green" ? "var(--c-green-soft)" : "var(--c-navy-soft)";
  return (
    <article className={`relative flex flex-col overflow-hidden rounded-3xl shadow-card ${bg}`}>
      <div className="relative flex-1 sm:min-h-[19rem]">
        {/* photo: top of the card on phones, the right side from tablets up. It stays sharp; only its edge blends into the card colour. */}
        <div className="relative aspect-[16/10] sm:absolute sm:inset-y-0 sm:right-0 sm:aspect-auto sm:w-[58%]">
          <SmartImage src={img.src} alt={alt} width={img.width} height={img.height} sizes="(min-width:1280px) 330px, (min-width:640px) 55vw, 100vw" className="h-full w-full object-cover object-[50%_30%]" />
          <div className="absolute inset-0 sm:hidden" style={{ backgroundImage: `linear-gradient(to top, rgb(${c}) 0%, rgb(${c} / 0) 30%)` }} aria-hidden />
          <div className="absolute inset-0 hidden sm:block" style={{ backgroundImage: `linear-gradient(to right, rgb(${c}) 0%, rgb(${c} / 0.6) 12%, rgb(${c} / 0) 34%)` }} aria-hidden />
        </div>
        {/* words on the left, over the plain card colour (the fade only just touches them) */}
        <div className="relative z-10 -mt-8 px-5 pb-5 sm:mt-0 sm:w-[56%] sm:p-7">{children}</div>
      </div>
      {skills}
    </article>
  );
}

export function ProgramCards({ nursery, classes, images, lang }: { nursery: Program[]; classes: Program[]; images: SiteImages; lang: Lang }) {
  const t = getDict(lang);
  const nurseryPic = slotImage(images, "nursery");
  const classesPic = slotImage(images, "classes");
  return (
    <section className="container-page grid gap-5 py-8 sm:py-10 xl:grid-cols-2" aria-label={t.cards.aria}>
      <Card tone="green" img={nurseryPic} alt={t.cards.nursery.imageAlt} skills={<Skills items={nursery} tones={NURSERY_TONES} />}>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green-dark">{t.cards.nursery.eyebrow}</p>
        <h2 className="mt-2 text-2xl font-extrabold leading-tight text-brand-navy-dark sm:text-[1.75rem]">{t.cards.nursery.title}</h2>
        <p className="mt-2 font-bold text-brand-green-dark">{t.cards.nursery.age}</p>
        <p className="mt-2 text-sm text-gray-700">{t.cards.nursery.text}</p>
        <Link href={localePath(lang, "/nursery")} className="btn-green mt-4">{t.cards.nursery.learnMore}<span className="sr-only">{t.cards.nursery.about}</span> <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </Card>
      <Card tone="blue" img={classesPic} alt={t.cards.classes.imageAlt} skills={<Skills items={classes} tones={CLASS_TONES} />}>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-navy">{t.cards.classes.eyebrow}</p>
        <h2 className="mt-2 whitespace-pre-line text-2xl font-extrabold leading-tight text-brand-navy-dark sm:text-[1.75rem]">{t.cards.classes.title.replace(/([.।]) /, "$1\n")}</h2>
        <p className="mt-2 font-bold text-brand-navy">{t.cards.classes.tagline}</p>
        <p className="mt-2 text-sm text-gray-700">{t.cards.classes.text}</p>
        <Link href={localePath(lang, "/classes")} className="btn-navy mt-4">{t.cards.classes.learnMore}<span className="sr-only">{t.cards.classes.about}</span> <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </Card>
    </section>
  );
}
