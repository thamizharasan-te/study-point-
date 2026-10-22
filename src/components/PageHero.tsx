import type { ReactNode } from "react";

/** Simple coloured banner at the top of inner pages. */
export function PageHero({ title, subtitle, tone = "green", children }: { title: string; subtitle?: string; tone?: "green" | "pink" | "navy"; children?: ReactNode }) {
  const bg = {
    green: "from-brand-green-soft to-white",
    pink: "from-brand-pink-soft to-white",
    navy: "from-brand-navy-soft to-white",
  }[tone];
  const color = { green: "text-brand-green", pink: "text-brand-pink", navy: "text-brand-navy" }[tone];
  return (
    <section className={`bg-gradient-to-b ${bg}`}>
      <div className="container-page py-10 text-center sm:py-14">
        <h1 className={`text-4xl font-extrabold sm:text-5xl ${color}`}>{title}</h1>
        {subtitle && <p className="mx-auto mt-3 max-w-2xl text-base text-gray-700 sm:text-lg">{subtitle}</p>}
        {children && <div className="mt-5 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>
    </section>
  );
}
