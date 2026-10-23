import type { Metadata } from "next";
import { EnquireButton } from "@/components/EnquireButton";
import { PageHero } from "@/components/PageHero";
import { ProgramList } from "@/components/ProgramList";
import { SmartImage } from "@/components/SmartImage";
import { getSiteData } from "@/lib/data";
import { slotImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "Study Point Classes — English, Spoken English & Exam Preparation",
  description: "English, grammar, phonics, spoken English, writing skills and exam preparation in small groups at Study Point, Point Pedro and Vathiry.",
  alternates: { canonical: "/classes" },
};

export default async function ClassesPage() {
  const { classPrograms, images } = await getSiteData();
  const pic = slotImage(images, "classes");
  return (
    <>
      <PageHero tone="navy" title="Study Point Classes" subtitle="Learn Today. Lead Tomorrow. English, Grammar, Phonics, Spoken English, Writing Skills, Exam Preparation and more.">
        <EnquireButton className="btn-navy" />
      </PageHero>

      <section className="container-page py-10">
        <h2 className="mb-6 text-center text-3xl font-extrabold text-brand-navy">What we teach</h2>
        <ProgramList items={classPrograms} accent="navy" />
      </section>

      <section className="bg-white py-10">
        <div className="container-page grid items-center gap-8 lg:grid-cols-2">
          <SmartImage src={pic.src} alt={pic.alt} width={pic.width} height={pic.height} sizes="(min-width:1024px) 480px, 100vw" className="aspect-[8/7] w-full rounded-3xl object-cover shadow-card" />
          <div className="space-y-3 text-gray-700">
            <h2 className="text-3xl font-extrabold text-brand-navy">Small groups, real progress</h2>
            <p>Our classes are kept small so every student is seen, heard and encouraged. Lessons mix clear teaching with plenty of speaking, reading and writing practice.</p>
            <p>We track each student&apos;s progress and help them prepare calmly for school exams.</p>
            <div className="pt-2"><EnquireButton className="btn-navy" /></div>
          </div>
        </div>
      </section>
    </>
  );
}
