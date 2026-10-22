import { Quote } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import { SampleTag } from "../SampleTag";

/** Parent comments. Placeholder quotes are clearly tagged and are NOT real parents. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  return (
    <section className="container-page reveal py-8" aria-labelledby="parents-title">
      <h2 id="parents-title" className="mb-4 text-2xl font-extrabold text-brand-navy sm:text-3xl">What Parents Say</h2>
      <ul className="grid gap-4 md:grid-cols-3">
        {items.map((t) => (
          <li key={t.id}>
            <figure className="lift h-full rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
              <Quote className="h-6 w-6 text-brand-pink/60" aria-hidden />
              <blockquote className="mt-2 text-sm text-gray-700 sm:text-base">{t.quote}</blockquote>
              <figcaption className="mt-3 flex flex-wrap items-center gap-2 text-sm font-bold text-brand-navy">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green-soft text-brand-green" aria-hidden>
                  {t.author.charAt(0).toUpperCase()}
                </span>
                {t.author}
                {t.is_placeholder && <SampleTag />}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
