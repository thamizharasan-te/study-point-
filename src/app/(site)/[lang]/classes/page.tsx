import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnquireButton } from "@/components/EnquireButton";
import { PageHero } from "@/components/PageHero";
import { ProgramList } from "@/components/ProgramList";
import { SmartImage } from "@/components/SmartImage";
import { getSiteData } from "@/lib/data";
import { getDict, isLang } from "@/lib/i18n";
import { localize } from "@/lib/i18n/localize";
import { pageMeta } from "@/lib/i18n/meta";
import { slotImage } from "@/lib/images";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDict(lang).pages.classes;
  return pageMeta(lang, "/classes", t.metaTitle, t.metaDescription);
}

export default async function ClassesPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const p = getDict(lang).pages.classes;
  const { classPrograms, images } = localize(await getSiteData(), lang);
  const pic = slotImage(images, "classes");
  return (
    <>
      <PageHero tone="navy" title={p.title} subtitle={p.subtitle}>
        <EnquireButton className="btn-navy" />
      </PageHero>

      <section className="container-page py-8 sm:py-10">
        <h2 className="mb-6 text-center text-3xl font-extrabold text-brand-navy">{p.teachTitle}</h2>
        <ProgramList items={classPrograms} accent="navy" />
      </section>

      <section className="bg-white py-8 sm:py-10">
        <div className="container-page grid items-center gap-8 lg:grid-cols-2">
          <SmartImage src={pic.src} alt={p.imageAlt} width={pic.width} height={pic.height} sizes="(min-width:1024px) 480px, 100vw" className="aspect-[8/7] w-full rounded-3xl object-cover object-[50%_35%] shadow-card" />
          <div className="space-y-3 text-gray-700">
            <h2 className="text-3xl font-extrabold text-brand-navy">{p.smallTitle}</h2>
            <p>{p.small1}</p>
            <p>{p.small2}</p>
            <div className="pt-2"><EnquireButton className="btn-navy" /></div>
          </div>
        </div>
      </section>
    </>
  );
}
