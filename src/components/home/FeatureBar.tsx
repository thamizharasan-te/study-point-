import { GraduationCap, Heart, Star, Users } from "lucide-react";
import { getDict, type Lang } from "@/lib/i18n";

// One bright colour per promise, like a box of crayons.
const TILES = [
  { icon: GraduationCap, tile: "bg-pink-100", dot: "bg-pink-500", rot: "-rotate-1" },
  { icon: Heart, tile: "bg-emerald-100", dot: "bg-emerald-500", rot: "rotate-1" },
  { icon: Users, tile: "bg-sky-100", dot: "bg-sky-500", rot: "-rotate-1" },
  { icon: Star, tile: "bg-amber-100", dot: "bg-amber-400", rot: "rotate-1" },
];

/** Four short promises as colourful sticker tiles under the hero. */
export function FeatureBar({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <section aria-label={t.features.aria} className="relative z-10 bg-brand-cream">
      <ul className="container-page grid gap-3 py-5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {t.features.items.map(({ title, text }, i) => {
          const { icon: Icon, tile, dot, rot } = TILES[i % TILES.length];
          return (
            <li key={title} className={`flex items-center gap-3 rounded-3xl p-3 shadow-sm ring-2 ring-white sm:p-4 ${tile} ${rot} sm:hover:rotate-0 sm:transition-transform`}>
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md sm:h-14 sm:w-14 ${dot}`}>
                <Icon className="h-7 w-7" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-extrabold text-brand-navy-dark sm:text-base">{title}</span>
                <span className="block text-xs text-gray-700 sm:text-sm">{text}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
