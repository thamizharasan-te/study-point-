import { Star } from "lucide-react";
import { getDict, type Lang } from "@/lib/i18n";
import type { Testimonial } from "@/lib/types";
import { SampleTag } from "../SampleTag";

/** Parent comments on a soft pink band. Placeholder quotes are clearly tagged and are NOT real parents. */
export function Testimonials({ items, lang }: { items: Testimonial[]; lang: Lang }) {
  const t = getDict(lang);
  if (!items.length) return null;
  return (
    <section className="bg-brand-pink-soft py-8 sm:py-10" aria-labelledby="parents-title">
      <div className="container-page grid gap-6 lg:grid-cols-[15rem_1fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-pink">{t.testimonials.eyebrow}</p>
          <h2 id="parents-title" className="mt-1 text-2xl font-extrabold text-brand-navy-dark sm:text-3xl">{t.testimonials.title}</h2>
          <span className="mt-2 block h-1 w-12 rounded-full bg-brand-pink" aria-hidden />
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <li key={item.id}>
              <figure className="lift flex h-full gap-3 rounded-2xl bg-white p-4 shadow-card">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-green-soft text-lg font-bold text-brand-green" aria-hidden>
                  {item.author.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <blockquote className="text-sm text-gray-700">“{item.quote}”</blockquote>
                  <div className="mt-2 flex gap-0.5 text-amber-400" aria-hidden>
                    {[0, 1, 2, 3, 4].map((n) => <Star key={n} className="h-4 w-4 fill-current" />)}
                  </div>
                  <figcaption className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-600">
                    — {item.author}
                    {item.is_placeholder && <SampleTag />}
                  </figcaption>
                </div>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
