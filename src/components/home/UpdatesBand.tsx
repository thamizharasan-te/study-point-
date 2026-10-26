import { getDict, fmt, type Lang } from "@/lib/i18n";
import type { Social } from "@/lib/types";
import { BRAND, ICONS } from "../SocialLinks";

const NAMES = { facebook: "Facebook", instagram: "Instagram", youtube: "YouTube" } as const;

/** "Visit Our Updates": one big button per social page the owner has filled in (Admin → Website Text). */
export function UpdatesBand({ social, lang }: { social: Social; lang: Lang }) {
  const t = getDict(lang);
  const shown = (Object.keys(ICONS) as (keyof typeof ICONS)[]).filter((k) => social[k]);
  if (!shown.length) return null;
  return (
    <section className="container-page py-8" aria-labelledby="updates-title">
      <div className="rounded-3xl bg-gradient-to-br from-brand-navy to-brand-navy-dark px-5 py-8 text-center text-white shadow-card sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-pink-200">{t.updates.eyebrow}</p>
        <h2 id="updates-title" className="mt-1 text-2xl font-extrabold sm:text-3xl">{t.updates.title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/85 sm:text-base">{t.updates.text}</p>
        <ul className="mt-5 flex flex-wrap justify-center gap-3">
          {shown.map((k) => (
            <li key={k}>
              <a
                href={social[k]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={fmt(t.updates.on, { name: NAMES[k] })}
                className="flex min-h-12 items-center gap-3 rounded-full bg-white py-2 pl-2 pr-5 font-bold text-brand-navy shadow-md transition-transform hover:-translate-y-0.5"
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-full text-white ${BRAND[k]}`}>
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">{ICONS[k]}</svg>
                </span>
                {NAMES[k]}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
