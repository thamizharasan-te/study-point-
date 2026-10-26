import { ClipboardList, GraduationCap, MessageCircle, School } from "lucide-react";
import { fmt, getDict, type Lang } from "@/lib/i18n";
import { EnquireButton } from "../EnquireButton";

// General steps only — no fees, dates or promises. Review wording with the client.
const ICONS = [ClipboardList, MessageCircle, School, GraduationCap];
const COLORS = [
  { card: "bg-pink-50 ring-pink-200", badge: "bg-pink-500", icon: "bg-pink-200 text-pink-700" },
  { card: "bg-sky-50 ring-sky-200", badge: "bg-sky-500", icon: "bg-sky-200 text-sky-700" },
  { card: "bg-amber-50 ring-amber-200", badge: "bg-amber-500", icon: "bg-amber-200 text-amber-800" },
  { card: "bg-emerald-50 ring-emerald-200", badge: "bg-emerald-500", icon: "bg-emerald-200 text-emerald-800" },
];

export function HowToJoin({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <section className="container-page reveal py-8 sm:py-10" aria-labelledby="join-title">
      <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-brand-navy">{t.join.kicker}</p>
      <h2 id="join-title" className="mt-1 text-center text-3xl font-extrabold text-brand-navy sm:text-4xl">{t.join.title}</h2>
      <span className="rainbow-bar mx-auto mt-2 block w-24" aria-hidden />
      <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {t.join.steps.map(({ title, text }, i) => {
          const Icon = ICONS[i];
          const c = COLORS[i % COLORS.length];
          return (
            <li key={title} className={`lift relative flex items-start gap-4 rounded-3xl p-4 text-left shadow-card ring-2 sm:block sm:p-6 sm:text-center ${c.card}`}>
              <span className={`absolute -top-2 left-3 flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold text-white sm:-top-3 sm:left-1/2 sm:h-7 sm:w-7 sm:-translate-x-1/2 sm:text-sm ${c.badge}`} aria-hidden>{i + 1}</span>
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:mx-auto sm:h-14 sm:w-14 ${c.icon}`}><Icon className="h-7 w-7" aria-hidden /></span>
              <div>
                <h3 className="text-lg font-bold text-brand-navy sm:mt-3"><span className="sr-only">{fmt(t.join.step, { n: i + 1 })}</span>{title}</h3>
              <p className="mt-1 text-sm text-gray-700">{text}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="mt-7 text-center"><EnquireButton /></div>
    </section>
  );
}
