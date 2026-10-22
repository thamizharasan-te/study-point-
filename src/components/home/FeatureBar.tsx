import { BookOpen, ChartColumn, Heart, Star, Users } from "lucide-react";

const FEATURES = [
  { icon: Heart, color: "text-brand-pink", title: "Safe & Caring", line2: "Environment" },
  { icon: Users, color: "text-brand-green", title: "Experienced", line2: "Teachers" },
  { icon: BookOpen, color: "text-brand-navy", title: "Fun & Effective", line2: "Learning Methods" },
  { icon: Star, color: "text-amber-500", title: "Small Class", line2: "Groups" },
  { icon: ChartColumn, color: "text-brand-green", title: "Continuous", line2: "Progress Tracking" },
];

export function FeatureBar() {
  return (
    <section aria-label="Highlights" className="container-page relative z-10 -mt-3 sm:-mt-6">
      <ul className="grid grid-cols-2 gap-3 rounded-3xl bg-white p-4 shadow-card sm:grid-cols-3 lg:grid-cols-5">
        {FEATURES.map(({ icon: Icon, color, title, line2 }) => (
          <li key={title} className="flex items-center gap-3 lg:justify-center">
            <Icon className={`h-8 w-8 shrink-0 ${color}`} aria-hidden />
            <span className="text-sm font-bold leading-tight text-brand-navy">{title}<br />{line2}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
