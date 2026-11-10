import { getDict, localePath, type Lang } from "@/lib/i18n";
import { SITE_URL } from "@/lib/utils";

const abs = (lang: Lang, path: string) => `${SITE_URL}${localePath(lang, path) === "/" ? "" : localePath(lang, path)}`;

/** "Home › Page" trail for search results. `path` is a page address such as "/about". */
export function breadcrumbSchema(lang: Lang, path: string) {
  const items = getDict(lang).nav.items;
  const here = items.find((i) => i.href === path);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: items[0].label, item: abs(lang, "/") },
      ...(here ? [{ "@type": "ListItem", position: 2, name: here.label, item: abs(lang, path) }] : []),
    ],
  };
}

/** The two 6-month diplomas (only facts the owner gave: names, duration, certificate on completion). */
export function courseSchemas(lang: Lang) {
  const t = getDict(lang).diplomas;
  return t.items.map((d) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    name: d.title,
    description: `${d.title} — ${t.duration}: ${d.duration}. ${t.certificate}`,
    url: abs(lang, "/classes"),
    inLanguage: lang,
    timeRequired: "P6M",
    educationalCredentialAwarded: "Certificate",
    provider: { "@type": "EducationalOrganization", name: "Study Point", url: SITE_URL },
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "onsite", courseWorkload: "P6M" },
  }));
}
