import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Heart, ShieldCheck, Sprout, Users } from "lucide-react";
import { EnquireButton } from "@/components/EnquireButton";
import { PageHero } from "@/components/PageHero";
import { SmartImage } from "@/components/SmartImage";
import { getSiteData } from "@/lib/data";
import { fmt, getDict, isLang, localePath } from "@/lib/i18n";
import { localize } from "@/lib/i18n/localize";
import { pageMeta } from "@/lib/i18n/meta";
import { slotImage } from "@/lib/images";

type Props = { params: Promise<{ lang: string }> };

const ICONS = [Heart, Sprout, Users, ShieldCheck];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDict(lang).pages.about;
  return pageMeta(lang, "/about", t.metaTitle, t.metaDescription);
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const p = t.pages.about;
  const { branches, images } = localize(await getSiteData(), lang);
  const pic = slotImage(images, "about");
  return (
    <>
      <PageHero title={p.title} subtitle={p.subtitle} />

      <section className="container-page grid items-center gap-8 py-10 lg:grid-cols-2">
        <SmartImage src={pic.src} alt={p.imageAlt} width={pic.width} height={pic.height} sizes="(min-width:1024px) 540px, 100vw" className="aspect-[10/7.6] w-full rounded-3xl object-cover shadow-card" />
        <div className="space-y-4 text-gray-700">
          <h2 className="text-3xl font-extrabold text-brand-navy">{p.storyTitle}</h2>
          <p>{fmt(p.story1, { branches: branches.map((b) => b.display_name ?? b.name).join(p.and) })}</p>
          <p>{p.story2}</p>
          <p>{p.story3}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href={localePath(lang, "/nursery")} className="btn-pink">{p.ourNursery}</Link>
            <Link href={localePath(lang, "/classes")} className="btn-navy">{p.ourClasses}</Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-10" aria-labelledby="values-title">
        <div className="container-page">
          <h2 id="values-title" className="text-center text-3xl font-extrabold text-brand-navy">{p.valuesTitle}</h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {p.values.map(({ title, text }, i) => {
              const Icon = ICONS[i];
              return (
                <li key={title} className="rounded-2xl bg-brand-cream p-5 text-center">
                  <Icon className="mx-auto h-9 w-9 text-brand-green" aria-hidden />
                  <h3 className="mt-2 text-lg font-bold text-brand-navy">{title}</h3>
                  <p className="mt-1 text-sm text-gray-700">{text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="container-page py-10 text-center">
        <h2 className="text-2xl font-extrabold text-brand-navy sm:text-3xl">{p.visitTitle}</h2>
        <p className="mt-2 text-gray-700">{p.visitText}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <EnquireButton />
          <Link href={localePath(lang, "/contact")} className="btn-outline">{p.findBranches}</Link>
        </div>
      </section>
    </>
  );
}
