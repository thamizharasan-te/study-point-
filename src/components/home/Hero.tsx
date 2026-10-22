import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HeroContent } from "@/lib/types";
import { SmartImage } from "../SmartImage";

/** Home hero. (The "Watch Our Story" video button is intentionally omitted until a video exists.) */
export function Hero({ hero }: { hero: HeroContent }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-green-soft via-white to-brand-pink-soft">
      <div className="container-page grid items-center gap-6 py-8 sm:py-12 lg:grid-cols-2 lg:gap-10 lg:py-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-navy sm:text-sm">{hero.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
            <span className="block text-brand-navy-dark">{hero.line1}</span>
            <span className="block text-brand-green">{hero.line2}</span>
            <span className="block text-brand-pink">{hero.line3}</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-gray-700 sm:text-lg">{hero.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/nursery" className="btn-pink">Explore Early Years <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <Link href="/classes" className="btn-green">Discover Our Classes <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] shadow-card">
            <SmartImage
              src="/placeholders/hero.svg"
              alt="Two smiling Study Point children learning together at a desk"
              width={1100}
              height={800}
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="h-auto w-full"
            />
          </div>
          <p className="absolute -top-2 right-2 rotate-6 rounded-3xl bg-white/90 px-4 py-2 text-center font-script text-lg leading-tight text-brand-green shadow-md sm:right-4 sm:text-2xl">
            Learn<br />Grow<br />Belong
          </p>
        </div>
      </div>
    </section>
  );
}
