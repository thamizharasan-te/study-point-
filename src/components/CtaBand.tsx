import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDict, localePath, type Lang } from "@/lib/i18n";
import { EnquireButton } from "./EnquireButton";

/** Closing call to action near the end of a page: apply online or send an enquiry. */
export function CtaBand({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <section className="container-page pb-10 pt-2 sm:pb-14 lg:pb-16" aria-labelledby="cta-title">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-navy-dark via-brand-navy to-brand-green-dark px-5 py-9 text-center text-white shadow-card sm:px-10 sm:py-12">
        {/* soft decorative shapes */}
        <span className="pointer-events-none absolute -left-10 -top-12 h-40 w-40 rounded-full bg-white/10" aria-hidden />
        <span className="pointer-events-none absolute -bottom-16 right-6 h-48 w-48 rounded-full bg-brand-pink/25" aria-hidden />
        <span className="pointer-events-none absolute right-1/4 top-6 h-4 w-4 rounded-full bg-amber-300/80" aria-hidden />
        <div className="relative">
          <h2 id="cta-title" className="text-[1.7rem] font-extrabold leading-tight sm:text-4xl">{t.cta.title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-white/90 sm:text-lg">{t.cta.text}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href={localePath(lang, "/apply")} className="btn-white">{t.join.applyNow} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <EnquireButton />
          </div>
        </div>
      </div>
    </section>
  );
}
