import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/home/CtaBand";
import { Faq } from "@/components/home/Faq";
import { FeatureBar } from "@/components/home/FeatureBar";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { Hero } from "@/components/home/Hero";
import { HowToJoin } from "@/components/home/HowToJoin";
import { ProgramCards } from "@/components/home/ProgramCards";
import { StatsBand } from "@/components/home/StatsBand";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyStudyPoint } from "@/components/home/WhyStudyPoint";
import { getSiteData } from "@/lib/data";
import { getDict, isLang } from "@/lib/i18n";
import { localize } from "@/lib/i18n/localize";
import { pageMeta } from "@/lib/i18n/meta";
import { SITE_URL } from "@/lib/utils";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDict(lang).pages.home;
  // The home page uses the site-wide title as-is (no "| Study Point" suffix).
  return { ...pageMeta(lang, "/", t.metaTitle, t.metaDescription), title: { absolute: t.metaTitle }, openGraph: { title: t.ogTitle, description: t.ogDescription, locale: lang === "ta" ? "ta_LK" : "en_LK" } };
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const site = localize(await getSiteData(), lang);

  // Structured data helps Google show the centre with its branches.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Study Point",
    url: SITE_URL,
    description: "Nursery (ages 3–5) and English tuition centre in Point Pedro and Vathiry, Sri Lanka.",
    department: site.branches.map((b) => ({
      "@type": "School",
      name: `Study Point — ${b.name}`,
      telephone: b.phones[0],
      address: { "@type": "PostalAddress", addressLocality: b.name, addressCountry: "LK" },
    })),
  };

  // FAQ rich results in Google.
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: site.faq.map((q) => ({ "@type": "Question", name: q.title, acceptedAnswer: { "@type": "Answer", text: q.description } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {site.faq.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <Hero hero={site.hero} images={site.images} lang={lang} />
      <FeatureBar lang={lang} />
      <ProgramCards nursery={site.nurseryPrograms} classes={site.classPrograms} images={site.images} lang={lang} />
      <WhyStudyPoint images={site.images} lang={lang} />
      <StatsBand stats={site.stats} lang={lang} />
      <HowToJoin lang={lang} />
      <GalleryPreview items={site.gallery} lang={lang} />
      <Testimonials items={site.testimonials} lang={lang} />
      <Faq items={site.faq} lang={lang} />
      <CtaBand branches={site.branches} lang={lang} />
    </>
  );
}
