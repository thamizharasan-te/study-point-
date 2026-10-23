import type { Metadata } from "next";
import Link from "next/link";
import { Heart, ShieldCheck, Sprout, Users } from "lucide-react";
import { EnquireButton } from "@/components/EnquireButton";
import { PageHero } from "@/components/PageHero";
import { SmartImage } from "@/components/SmartImage";
import { getSiteData } from "@/lib/data";
import { slotImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Study Point — a caring nursery and English tuition centre serving families in Point Pedro and Vathiry, Sri Lanka.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  { icon: Heart, title: "Care first", text: "Every child is welcomed warmly and treated with patience and kindness." },
  { icon: Sprout, title: "Learning through joy", text: "Play, stories and activities make learning something children look forward to." },
  { icon: Users, title: "Small groups", text: "Small classes mean teachers know each child and can support them properly." },
  { icon: ShieldCheck, title: "A safe place", text: "A friendly, supervised environment that parents can trust." },
];

export default async function AboutPage() {
  const { branches, images } = await getSiteData();
  const pic = slotImage(images, "about");
  return (
    <>
      <PageHero title="About Study Point" subtitle="A nursery and English learning centre where little learners grow into confident, capable students." />

      <section className="container-page grid items-center gap-8 py-10 lg:grid-cols-2">
        <SmartImage src={pic.src} alt={pic.alt} width={pic.width} height={pic.height} sizes="(min-width:1024px) 540px, 100vw" className="aspect-[10/7.6] w-full rounded-3xl object-cover shadow-card" />
        <div className="space-y-4 text-gray-700">
          <h2 className="text-3xl font-extrabold text-brand-navy">Our story</h2>
          <p>
            Study Point brings an early years nursery and quality English education together under one roof, so families
            in {branches.map((b) => b.name).join(" and ")} can find caring, well-structured learning close to home.
          </p>
          <p>
            Our <strong>Nursery</strong> (ages 3 to 5) builds a strong foundation through phonics, creative activities and
            play-based learning. <strong>Study Point Classes</strong> help older children grow in English — grammar, spoken
            English, writing skills and exam preparation — in small groups.
          </p>
          <p>We believe every child is a story waiting to be a success, and we are here to help write it.</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/nursery" className="btn-pink">Our Nursery</Link>
            <Link href="/classes" className="btn-navy">Our Classes</Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-10" aria-labelledby="values-title">
        <div className="container-page">
          <h2 id="values-title" className="text-center text-3xl font-extrabold text-brand-navy">What we stand for</h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-2xl bg-brand-cream p-5 text-center">
                <Icon className="mx-auto h-9 w-9 text-brand-green" aria-hidden />
                <h3 className="mt-2 text-lg font-bold text-brand-navy">{title}</h3>
                <p className="mt-1 text-sm text-gray-700">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-10 text-center">
        <h2 className="text-2xl font-extrabold text-brand-navy sm:text-3xl">Visit us in Point Pedro or Vathiry</h2>
        <p className="mt-2 text-gray-700">Come and see our classrooms, meet our teachers and ask anything you like.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <EnquireButton />
          <Link href="/contact" className="btn-outline">Find our branches</Link>
        </div>
      </section>
    </>
  );
}
