import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { slotImage } from "@/lib/images";
import type { Program, SiteImages } from "@/lib/types";
import { ProgramIcon } from "../ProgramIcon";
import { SmartImage } from "../SmartImage";

/** The two big cards: Nursery (pink) and Study Point Classes (blue). */
export function ProgramCards({ nursery, classes, images }: { nursery: Program[]; classes: Program[]; images: SiteImages }) {
  const nurseryPic = slotImage(images, "nursery");
  const classesPic = slotImage(images, "classes");
  return (
    <section className="container-page reveal grid gap-5 py-10 lg:grid-cols-2" aria-label="Our programs">
      <article className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-pink-soft to-amber-50 shadow-card">
        <div className="grid grid-cols-5 items-center gap-2 p-5 sm:p-7">
          <div className="col-span-3">
            <h2 className="text-4xl font-extrabold text-brand-pink sm:text-5xl">Nursery</h2>
            <p className="font-display text-2xl font-bold text-brand-pink">3 – 5 Years</p>
            <p className="mt-2 text-sm font-semibold text-brand-navy sm:text-base">A happy place to learn, play and grow!</p>
            <p className="mt-2 text-sm text-gray-700">
              We provide a strong foundation through play-based learning, creativity and structured early years activities.
            </p>
            <Link href="/nursery" className="btn-pink mt-4">Learn More<span className="sr-only"> about our Nursery</span> <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
          <div className="col-span-2">
            <SmartImage src={nurseryPic.src} alt={nurseryPic.alt} width={nurseryPic.width} height={nurseryPic.height} sizes="(min-width:1024px) 220px, 40vw" className="aspect-[8/7] w-full rounded-2xl object-cover" />
          </div>
        </div>
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-3 bg-white/70 px-3 py-4">
          {nursery.map((p) => (
            <li key={p.title} className="flex w-24 flex-col items-center gap-1 text-center text-xs font-semibold text-brand-navy">
              <ProgramIcon title={p.title} className="h-8 w-8 text-brand-pink" />
              {p.title}
            </li>
          ))}
        </ul>
      </article>

      <article className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy-soft to-white shadow-card">
        <div className="grid grid-cols-5 items-center gap-2 p-5 sm:p-7">
          <div className="col-span-3">
            <h2 className="text-3xl font-extrabold text-brand-navy sm:text-4xl">Study Point Classes</h2>
            <p className="mt-1 font-display text-lg font-bold text-brand-green sm:text-xl">Learn Today. Lead Tomorrow.</p>
            <p className="mt-2 text-sm text-gray-700">
              English, Grammar, Phonics, Spoken English, Writing Skills, Exam Preparation and more — for a brighter future.
            </p>
            <Link href="/classes" className="btn-navy mt-4">Learn More<span className="sr-only"> about Study Point Classes</span> <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
          <div className="col-span-2">
            <SmartImage src={classesPic.src} alt={classesPic.alt} width={classesPic.width} height={classesPic.height} sizes="(min-width:1024px) 220px, 40vw" className="aspect-[8/7] w-full rounded-2xl object-cover" />
          </div>
        </div>
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-3 bg-white/70 px-3 py-4">
          {classes.map((p) => (
            <li key={p.title} className="flex w-24 flex-col items-center gap-1 text-center text-xs font-semibold text-brand-navy">
              <ProgramIcon title={p.title} className="h-8 w-8 text-brand-navy" />
              {p.title}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
