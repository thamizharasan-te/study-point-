import Link from "next/link";
import { Award, BookOpen, Clock, Mic } from "lucide-react";
import { getDict, localePath, type Lang } from "@/lib/i18n";

const ICONS = [Mic, BookOpen];
const TONES = ["bg-pink-100 text-brand-pink", "bg-sky-100 text-sky-700"];

/** The two 6-month diploma courses, shown on the home page and the Classes page. */
export function DiplomaBand({ lang }: { lang: Lang }) {
  const t = getDict(lang).diplomas;
  return (
    <section className="container-page py-8 sm:py-10" aria-label={t.aria}>
      <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-white to-pink-50 p-5 shadow-card ring-1 ring-amber-100 sm:p-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.15em] text-brand-pink">{t.kicker}</p>
        <h2 className="mt-2 text-center text-2xl font-extrabold leading-tight text-brand-navy sm:text-3xl">{t.title}</h2>
        <ul className="mx-auto mt-6 grid max-w-3xl gap-4 sm:grid-cols-2">
          {t.items.map((d, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <li key={d.title} className="lift flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card">
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${TONES[i % TONES.length]}`}>
                  <Icon className="h-7 w-7" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-lg font-extrabold leading-snug text-brand-navy">{d.title}</span>
                  <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                    <Clock className="h-4 w-4 text-brand-green" aria-hidden />
                    {t.duration}: {d.duration}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mx-auto mt-5 flex max-w-3xl items-center justify-center gap-2 text-center text-sm font-bold text-brand-green-dark sm:text-base">
          <Award className="h-5 w-5 shrink-0" aria-hidden />
          {t.certificate}
        </p>
        <div className="mt-5 text-center">
          <Link href={localePath(lang, "/apply")} className="btn-green">{t.apply}</Link>
        </div>
      </div>
    </section>
  );
}
