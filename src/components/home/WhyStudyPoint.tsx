import { ChartColumn, Heart, ShieldCheck, Star, Users } from "lucide-react";
import { slotImage } from "@/lib/images";
import type { SiteImages } from "@/lib/types";
import { SmartImage } from "../SmartImage";

const REASONS = [
  { icon: Users, bg: "bg-brand-green", title: "Caring & Qualified Teachers", text: "Guiding every child with patience and support." },
  { icon: ShieldCheck, bg: "bg-brand-pink", title: "Safe & Friendly Environment", text: "A place where children feel at home." },
  { icon: ChartColumn, bg: "bg-brand-navy", title: "Well-Structured Programs", text: "Designed for each stage of learning." },
  { icon: Star, bg: "bg-amber-500", title: "Focus on Overall Development", text: "Building confidence for life beyond the classroom." },
];

export function WhyStudyPoint({ images }: { images: SiteImages }) {
  const pic = slotImage(images, "why");
  return (
    <section className="reveal bg-white py-12" aria-labelledby="why-title">
      <div className="container-page grid items-center gap-8 lg:grid-cols-[1fr_2fr_1fr]">
        <SmartImage src={pic.src} alt={pic.alt} width={pic.width} height={pic.height} sizes="(min-width:1024px) 280px, 100vw" className="hidden aspect-[8/7] w-full rounded-3xl object-cover lg:block" />
        <div>
          <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-brand-navy">Why choose Study Point?</p>
          <h2 id="why-title" className="mt-1 text-center text-3xl font-extrabold text-brand-navy sm:text-4xl">More Than Just Classes</h2>
          <p className="mx-auto mt-2 max-w-md text-center text-gray-700">
            We nurture confident, creative and independent learners for a brighter tomorrow.
          </p>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            {REASONS.map(({ icon: Icon, bg, title, text }) => (
              <li key={title} className="flex items-start gap-3">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white ${bg}`}><Icon className="h-6 w-6" aria-hidden /></span>
                <span>
                  <span className="block font-bold text-brand-navy">{title}</span>
                  <span className="text-sm text-gray-600">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <blockquote className="rounded-3xl bg-brand-cream p-6 text-center font-display text-xl text-brand-navy shadow-card">
          Every child is a story waiting to be a success.
          <Heart className="mx-auto mt-3 h-5 w-5 text-brand-pink" aria-hidden />
        </blockquote>
      </div>
    </section>
  );
}
