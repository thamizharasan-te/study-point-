import type { MetadataRoute } from "next";
import { localePath } from "@/lib/i18n";
import { SITE_URL } from "@/lib/utils";

/** Every page in English and Tamil, each pointing at its translation (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/about", "/nursery", "/classes", "/gallery", "/contact"];
  return paths.flatMap((p) =>
    (["en", "ta"] as const).map((lang) => ({
      url: `${SITE_URL}${localePath(lang, p) === "/" ? "" : localePath(lang, p)}`,
      lastModified: new Date(),
      changeFrequency: p === "/" || p === "/gallery" ? ("weekly" as const) : ("monthly" as const),
      priority: p === "/" ? 1 : 0.7,
      alternates: {
        languages: {
          en: `${SITE_URL}${localePath("en", p) === "/" ? "" : localePath("en", p)}`,
          ta: `${SITE_URL}${localePath("ta", p)}`,
        },
      },
    })),
  );
}
