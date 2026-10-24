import type { Metadata } from "next";
import { localePath, type Lang } from "./index";

/** canonical + hreflang links so Google shows the right language to the right visitor. */
export function pageMeta(lang: Lang, path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: localePath(lang, path),
      languages: { en: localePath("en", path), ta: localePath("ta", path), "x-default": localePath("en", path) },
    },
    openGraph: { title, description, locale: lang === "ta" ? "ta_LK" : "en_LK", alternateLocale: lang === "ta" ? "en_LK" : "ta_LK" },
  };
}
