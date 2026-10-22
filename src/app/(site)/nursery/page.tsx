import type { Metadata } from "next";
import { EnquireButton } from "@/components/EnquireButton";
import { PageHero } from "@/components/PageHero";
import { ProgramList } from "@/components/ProgramList";
import { SmartImage } from "@/components/SmartImage";
import { getSiteData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nursery (Ages 3–5)",
  description: "Study Point Nursery for children aged 3 to 5 in Point Pedro and Vathiry: phonics, creative activities, play based learning, social skills and confidence building.",
  alternates: { canonical: "/nursery" },
};

export default async function NurseryPage() {
  const { nurseryPrograms } = await getSiteData();
  return (
    <>
      <PageHero tone="pink" title="Nursery · 3 – 5 Years" subtitle="A happy place to learn, play and grow! A strong foundation through play-based learning, creativity and structured early years activities.">
        <EnquireButton />
      </PageHero>

      <section className="container-page py-10">
        <h2 className="mb-6 text-center text-3xl font-extrabold text-brand-navy">What your child will learn</h2>
        <ProgramList items={nurseryPrograms} accent="pink" />
      </section>

      <section className="bg-white py-10">
        <div className="container-page grid items-center gap-8 lg:grid-cols-2">
          <div className="space-y-3 text-gray-700">
            <h2 className="text-3xl font-extrabold text-brand-navy">A gentle start to school life</h2>
            <p>Young children learn best when they feel safe and happy. Our nursery days mix songs, stories, hands-on play and simple early literacy activities.</p>
            <p>Teachers keep groups small, celebrate every small step and keep parents informed about how their child is growing.</p>
            <div className="pt-2"><EnquireButton /></div>
          </div>
          <SmartImage src="/placeholders/nursery.svg" alt="Nursery children playing with colourful blocks" width={800} height={700} sizes="(min-width:1024px) 480px, 100vw" className="h-auto w-full rounded-3xl shadow-card" />
        </div>
      </section>
    </>
  );
}
