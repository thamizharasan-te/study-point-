import { ChevronDown } from "lucide-react";
import { getDict, type Lang } from "@/lib/i18n";
import type { Program } from "@/lib/types";

/** Accordion built on <details>, so it works without JavaScript and is keyboard/screen-reader friendly. */
export function Faq({ items, lang }: { items: Program[]; lang: Lang }) {
  const t = getDict(lang);
  if (!items.length) return null;
  return (
    <section className="container-page reveal py-8 sm:py-10" aria-labelledby="faq-title">
      <h2 id="faq-title" className="text-center text-3xl font-extrabold text-brand-navy sm:text-4xl">{t.faq.title}</h2>
      <span className="rainbow-bar mx-auto mt-2 block w-24" aria-hidden />
      <div className="mx-auto mt-6 max-w-3xl space-y-3">
        {items.map((q, i) => (
          <details key={q.title} className={`group rounded-2xl border-l-8 bg-white shadow-card open:ring-2 open:ring-brand-green/30 ${["border-pink-400", "border-sky-400", "border-amber-400", "border-emerald-400", "border-purple-400"][i % 5]}`}>
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left font-bold text-brand-navy [&::-webkit-details-marker]:hidden">
              {q.title}
              <ChevronDown className="h-5 w-5 shrink-0 text-brand-green transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <p className="px-5 pb-5 text-gray-700">{q.description}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
