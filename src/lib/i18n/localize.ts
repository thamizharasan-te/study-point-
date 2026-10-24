import type { SiteData } from "../types";
import { DEFAULT_TA } from "./content-ta";
import { getDict, type Lang } from "./index";

/** Tamil version if the owner typed one, else the standard Tamil for default text, else English. */
export const pickTa = (en: string, ta?: string) => (ta && ta.trim()) || DEFAULT_TA[en] || en;

/**
 * Returns the site content in the visitor's language. English is returned
 * untouched; for Tamil each editable text uses the owner's Tamil version when
 * present and otherwise falls back (see pickTa).
 */
export function localize(data: SiteData, lang: Lang): SiteData {
  const names = getDict(lang).branchNames;
  const withNames = data.branches.map((b) => ({ ...b, display_name: names[b.id] ?? b.name }));
  if (lang === "en") return { ...data, branches: withNames };

  const prog = (list: SiteData["nurseryPrograms"]) =>
    list.map((p) => ({ ...p, title: pickTa(p.title, p.title_ta), description: pickTa(p.description, p.description_ta) }));
  const ta = data.hero.ta ?? {};

  return {
    ...data,
    hero: {
      ...data.hero,
      eyebrow: pickTa(data.hero.eyebrow, ta.eyebrow),
      line1: pickTa(data.hero.line1, ta.line1),
      line2: pickTa(data.hero.line2, ta.line2),
      line3: pickTa(data.hero.line3, ta.line3),
      subtitle: pickTa(data.hero.subtitle, ta.subtitle),
    },
    nurseryPrograms: prog(data.nurseryPrograms),
    classPrograms: prog(data.classPrograms),
    faq: prog(data.faq),
    stats: data.stats.map((s) => ({ ...s, label: pickTa(s.label, s.label_ta) })),
    testimonials: data.testimonials.map((t) => ({ ...t, quote: pickTa(t.quote, t.quote_ta) })),
    announcements: data.announcements.map((a) => ({ ...a, text: pickTa(a.text, a.text_ta) })),
    branches: withNames.map((b) => ({ ...b, address: pickTa(b.address, b.address_ta), hours: b.hours ? pickTa(b.hours, b.hours_ta) : b.hours })),
  };
}

/** Value to pre-fill in an admin "Tamil" box: the owner's Tamil, else the standard Tamil for default text, else empty. */
export const taValue = (en: string, ta?: string) => (ta && ta.trim()) || DEFAULT_TA[en] || "";
