import { BookOpen, ChartColumn, Heart, Star, Users } from "lucide-react";
import { getDict, type Lang } from "@/lib/i18n";

const ICONS = [
  { icon: Heart, color: "text-brand-pink" },
  { icon: Users, color: "text-brand-green" },
  { icon: BookOpen, color: "text-brand-navy" },
  { icon: Star, color: "text-amber-500" },
  { icon: ChartColumn, color: "text-brand-green" },
];

export function FeatureBar({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <section aria-label={t.features.aria} className="container-page relative z-10 -mt-3 sm:-mt-6">
      <ul className="grid grid-cols-1 gap-x-3 gap-y-4 rounded-3xl bg-white p-5 sm:p-4 shadow-card sm:grid-cols-3 lg:grid-cols-5">
        {t.features.items.map((label, i) => {
          const { icon: Icon, color } = ICONS[i];
          return (
            <li key={label} className="flex items-center gap-3 lg:justify-center">
              <Icon className={`h-8 w-8 shrink-0 ${color}`} aria-hidden />
              <span className="min-w-0 text-sm font-bold leading-tight text-brand-navy">{label}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
