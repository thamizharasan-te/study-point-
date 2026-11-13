import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiplomaBand } from "@/components/home/DiplomaBand";
import { Faq } from "@/components/home/Faq";
import { FeatureBar } from "@/components/home/FeatureBar";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { Hero } from "@/components/home/Hero";
import { HowToJoin } from "@/components/home/HowToJoin";
import { ProgramCards } from "@/components/home/ProgramCards";
import { UpdatesBand } from "@/components/home/UpdatesBand";
import { StatsBand } from "@/components/home/StatsBand";
import { Testimonials } from "@/components/home/Testimonials";
import { getSiteData } from "@/lib/data";
import { getDict, isLang } from "@/lib/i18n";
import { localize } from "@/lib/i18n/localize";
import { pageMeta } from "@/lib/i18n/meta";
import { internationalPhone, SITE_URL } from "@/lib/utils";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { courseSchemas } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDict(lang).pages.home;
  const base = pageMeta(lang, "/", t.metaTitle, t.metaDescription);
  // The home page uses the site-wide title as-is (no "| Study Point" suffix).
  return { ...base, title: { absolute: t.metaTitle }, openGraph: { ...base.openGraph, title: t.ogTitle, description: t.ogDescription } };
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const site = localize(await getSiteData(), lang);

  const socialLinks = Object.values(site.social).filter((u) => /^https?:\/\//.test(u));

  // Structured data helps Google show the centre with its branches.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Study Point",
    alternateName: ["Study Point LK", "StudyPointLK"],
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/opengraph-image`,
    // Official pages (filled in Admin → Website Text → social links); empty ones are left out.
    sameAs: socialLinks.length ? socialLinks : undefined,
    areaServed: site.branches.map((b) => b.name),
    contactPoint: site.branches[0]?.phones[0]
      ? [{ "@type": "ContactPoint", contactType: "customer service", telephone: internationalPhone(site.branches[0].phones[0]), availableLanguage: ["English", "Tamil"] }]
      : undefined,
    description: "Kindergarten (ages 3–5) and English tuition centre in Point Pedro and Vathiry, Sri Lanka.",
    department: site.branches.map((b) => ({
      "@type": "School",
      name: `Study Point — ${b.name}`,
      telephone: b.phones[0] ? internationalPhone(b.phones[0]) : undefined,
      // The saved street address is included once the branch details are confirmed (not while they are only sample text).
      address: { "@type": "PostalAddress", ...(b.is_placeholder ? {} : { streetAddress: b.address }), addressLocality: b.name, addressCountry: "LK" },
    })),
  };

  // Tells Google the site's name and the other ways people write it ("Study Point LK", the web address), so a search
  // for "studypointlk" can find this site instead of a similarly named one.
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Study Point",
    alternateName: ["Study Point LK", "StudyPointLK", "studypointlk.com"],
    url: SITE_URL,
    inLanguage: ["en", "ta"],
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
      <JsonLd data={[websiteLd, jsonLd, ...(site.faq.length > 0 ? [faqLd] : []), ...courseSchemas(lang)]} />
      <Hero hero={site.hero} images={site.images} lang={lang} />
      <FeatureBar lang={lang} />
      <ProgramCards nursery={site.nurseryPrograms} classes={site.classPrograms} images={site.images} lang={lang} />
      <DiplomaBand lang={lang} />
      <GalleryPreview items={site.gallery} lang={lang} />
      <UpdatesBand social={site.social} lang={lang} />
      <Testimonials items={site.testimonials} lang={lang} />
      <StatsBand stats={site.stats} lang={lang} />
      <HowToJoin lang={lang} />
      <Faq items={site.faq} lang={lang} />
      <CtaBand lang={lang} />
    </>
  );
}
