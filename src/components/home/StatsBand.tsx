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
      <ul className="flex flex-wrap justify-around gap-x-8 gap-y-5 rounded-3xl bg-brand-cream p-6 shadow-card">
        {stats.map((s) => {
          const Icon = ICONS[s.key] ?? Star;
          return (
            <li key={s.key} className="flex items-center gap-3">
              <Icon className={`h-9 w-9 shrink-0 ${COLORS[s.key] ?? ""}`} aria-hidden />
              <span>
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
