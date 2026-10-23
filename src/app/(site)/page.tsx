import type { Metadata } from "next";
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
import { SITE_URL } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const site = await getSiteData();

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
    mainEntity: site.faq.map((q) => ({ "@type": "Question", name: q.title, acceptedAnswer: { "@type": "Answer", text: q.description } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {site.faq.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <Hero hero={site.hero} images={site.images} />
      <FeatureBar />
      <ProgramCards nursery={site.nurseryPrograms} classes={site.classPrograms} images={site.images} />
      <WhyStudyPoint images={site.images} />
      <StatsBand stats={site.stats} />
      <HowToJoin />
      <GalleryPreview items={site.gallery} />
      <Testimonials items={site.testimonials} />
      <Faq items={site.faq} />
      <CtaBand branches={site.branches} />
    </>
  );
}
