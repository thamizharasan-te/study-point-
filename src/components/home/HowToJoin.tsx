import { ClipboardList, GraduationCap, MessageCircle, School } from "lucide-react";
import { fmt, getDict, type Lang } from "@/lib/i18n";
import { EnquireButton } from "../EnquireButton";

// General steps only — no fees, dates or promises. Review wording with the client.
const ICONS = [ClipboardList, MessageCircle, School, GraduationCap];

export function HowToJoin({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <section className="container-page reveal py-8 sm:py-10" aria-labelledby="join-title">
      <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-brand-navy">{t.join.kicker}</p>
      <h2 id="join-title" className="mt-1 text-center text-3xl font-extrabold text-brand-navy sm:text-4xl">{t.join.title}</h2>
      <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {t.join.steps.map(({ title, text }, i) => {
          const Icon = ICONS[i];
          return (
            <li key={title} className="lift relative flex items-start gap-4 rounded-3xl bg-white p-4 text-left shadow-card sm:block sm:p-6 sm:text-center">
              <span className="absolute -top-2 left-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-pink text-xs font-extrabold text-white sm:-top-3 sm:left-1/2 sm:h-7 sm:w-7 sm:-translate-x-1/2 sm:text-sm" aria-hidden>{i + 1}</span>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-green-soft text-brand-green sm:mx-auto sm:h-14 sm:w-14"><Icon className="h-7 w-7" aria-hidden /></span>
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
