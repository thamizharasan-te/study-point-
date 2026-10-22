import type { Metadata } from "next";
import { CtaBand } from "@/components/home/CtaBand";
import { FeatureBar } from "@/components/home/FeatureBar";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { Hero } from "@/components/home/Hero";
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero hero={site.hero} />
      <FeatureBar />
      <ProgramCards nursery={site.nurseryPrograms} classes={site.classPrograms} />
      <WhyStudyPoint />
      <StatsBand stats={site.stats} />
      <GalleryPreview items={site.gallery} />
      <Testimonials items={site.testimonials} />
      <CtaBand branches={site.branches} />
    </>
  );
}
