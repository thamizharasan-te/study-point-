import { GraduationCap, Heart, Star, Users } from "lucide-react";
import { getDict, type Lang } from "@/lib/i18n";

const ICONS = [
  { icon: GraduationCap, color: "text-brand-pink" },
  { icon: Heart, color: "text-brand-green" },
  { icon: Users, color: "text-sky-600" },
  { icon: Star, color: "text-amber-500" },
];

/** Four short promises under the hero. */
export function FeatureBar({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <section aria-label={t.features.aria} className="border-y border-gray-100 bg-white">
      <ul className="container-page grid gap-x-6 gap-y-5 py-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-y-0">
        {t.features.items.map(({ title, text }, i) => {
          const { icon: Icon, color } = ICONS[i % ICONS.length];
          return (
            <li key={title} className="flex items-center gap-3 xl:justify-center">
              <Icon className={`h-9 w-9 shrink-0 ${color}`} aria-hidden />
              <span className="min-w-0">
                <span className="block text-sm font-bold text-brand-navy sm:text-base">{title}</span>
                <span className="block text-xs text-gray-600 sm:text-sm">{text}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
