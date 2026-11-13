import type { ReactNode } from "react";
import { Crumbs } from "./Crumbs";

/** Simple coloured banner at the top of inner pages. */
export function PageHero({ title, subtitle, tone = "green", children }: { title: string; subtitle?: string; tone?: "green" | "pink" | "navy"; children?: ReactNode }) {
  const bg = {
    green: "from-brand-green-soft to-white",
    pink: "from-brand-pink-soft to-white",
    navy: "from-brand-navy-soft to-white",
  }[tone];
  const color = { green: "text-brand-green", pink: "text-brand-pink", navy: "text-brand-navy" }[tone];
  return (
    <section className={`relative overflow-hidden bg-gradient-to-b ${bg}`}>
      {/* soft decorative shapes behind the title */}
      <span className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/60" aria-hidden />
      <span className="pointer-events-none absolute -right-10 top-8 h-32 w-32 rounded-full bg-amber-200/40" aria-hidden />
      <span className="pointer-events-none absolute bottom-4 left-[12%] hidden h-5 w-5 rounded-full bg-brand-pink/30 sm:block" aria-hidden />
      <div className="container-page relative py-10 text-center sm:py-14">
        <Crumbs />
        <h1 className={`text-4xl font-extrabold sm:text-5xl ${color}`}>{title}</h1>
        {subtitle && <p className="mx-auto mt-3 max-w-2xl text-base text-gray-700 sm:text-lg">{subtitle}</p>}
        {children && <div className="mt-5 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>
    </section>
  );
}
