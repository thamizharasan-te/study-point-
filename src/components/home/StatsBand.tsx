import { GraduationCap, Heart, MapPin, Star } from "lucide-react";
import { getDict, type Lang } from "@/lib/i18n";
import type { SiteStat } from "@/lib/types";
import { SampleTag } from "../SampleTag";

const ICONS = { children: GraduationCap, years: Heart, branches: MapPin, satisfaction: Star } as const;
const COLORS = { children: "text-brand-green", years: "text-brand-pink", branches: "text-brand-navy", satisfaction: "text-amber-500" } as const;

/** Counters. Unconfirmed numbers carry a "Sample" tag until the client saves real ones in /admin. */
export function StatsBand({ stats, lang }: { stats: SiteStat[]; lang: Lang }) {
  const t = getDict(lang);
  if (!stats.length) return null;
  return (
    <section aria-label={t.stats.aria} className="container-page reveal py-8">
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s, n) => {
          const Icon = ICONS[s.key] ?? Star;
          return (
            <li key={s.key} className={`flex min-w-0 items-center gap-3 rounded-3xl p-4 shadow-sm ring-2 ring-white ${["bg-emerald-100", "bg-pink-100", "bg-sky-100", "bg-amber-100"][n % 4]}`}>
              <Icon className={`h-9 w-9 shrink-0 ${COLORS[s.key] ?? ""}`} aria-hidden />
              <span className="min-w-0 break-words">
                <span className="block font-display text-2xl font-extrabold text-brand-navy sm:text-3xl">{s.value}</span>
                <span className="block text-xs font-semibold text-gray-700 sm:text-sm">{s.label}</span>
                {s.is_placeholder && <SampleTag />}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
