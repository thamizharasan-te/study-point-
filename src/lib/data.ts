import { cache } from "react";
import {
  DEFAULT_BRANCHES, DEFAULT_CLASS_PROGRAMS, DEFAULT_FAQ, DEFAULT_GALLERY, DEFAULT_HERO,
  DEFAULT_NURSERY_PROGRAMS, DEFAULT_SOCIAL, DEFAULT_STATS, DEFAULT_TESTIMONIALS,
} from "./defaults";
import { SHOW_SAMPLE } from "./sample";
import { createPublicClient } from "./supabase/public";
import type {
  Announcement, Branch, GalleryItem, HeroContent, Program, SiteData, SiteImages, SiteStat, Social, Testimonial,
} from "./types";

/**
 * Loads all public content from Supabase. Each part falls back to the
 * defaults in ./defaults.ts when Supabase is not set up or a query fails,
 * so the site never shows a blank section.
 */
/**
 * Hides unconfirmed sample content from the public site (see ./sample.ts):
 *  - example numbers and example comments are dropped,
 *  - sample gallery pictures are dropped as soon as one real photo exists,
 *  - unconfirmed branch opening hours are blanked.
 */
function publicView(d: SiteData): SiteData {
  const v = hideSamples(d);
  return { ...v, gallery: describeUniquely(v.gallery) };
}

/**
 * Picture descriptions (alt text) shown to visitors: stray accent marks typed by accident are dropped, and when
 * several photos share the same description each one gets its own number, so screen readers can tell them apart.
 */
function describeUniquely(gallery: GalleryItem[]): GalleryItem[] {
  const strip = (t: string) => t.replace(/[\u0300-\u036f]/g, "").trim();
  const numbered = (texts: string[]) => {
    const total = new Map<string, number>();
    for (const t of texts) if (t) total.set(t, (total.get(t) ?? 0) + 1);
    const seen = new Map<string, number>();
    return texts.map((t) => {
      if (!t || (total.get(t) ?? 0) < 2) return t;
      const n = (seen.get(t) ?? 0) + 1;
      seen.set(t, n);
      return `${t} (${n})`;
    });
  };
  const alts = numbered(gallery.map((g) => strip(g.alt)));
  const altsTa = numbered(gallery.map((g) => strip(g.alt_ta ?? "")));
  return gallery.map((g, i) => ({ ...g, alt: alts[i], alt_ta: altsTa[i] }));
}

function hideSamples(d: SiteData): SiteData {
  if (SHOW_SAMPLE) return d;
  const hasRealPhotos = d.gallery.some((g) => !g.is_sample);
  return {
    ...d,
    stats: d.stats.filter((s) => !s.is_placeholder),
    testimonials: d.testimonials.filter((t) => !t.is_placeholder),
    gallery: hasRealPhotos ? d.gallery.filter((g) => !g.is_sample) : d.gallery,
    branches: d.branches.map((b) => (b.is_placeholder ? { ...b, hours: "" } : b)),
  };
}

export const getSiteData = cache(async (): Promise<SiteData> => publicView(await loadSiteData()));

async function loadSiteData(): Promise<SiteData> {
  const db = createPublicClient();
  const fallback: SiteData = {
    hero: DEFAULT_HERO,
    nurseryPrograms: DEFAULT_NURSERY_PROGRAMS,
    classPrograms: DEFAULT_CLASS_PROGRAMS,
    faq: DEFAULT_FAQ,
    social: DEFAULT_SOCIAL,
    images: {},
    stats: DEFAULT_STATS,
    testimonials: DEFAULT_TESTIMONIALS,
    gallery: DEFAULT_GALLERY,
    branches: DEFAULT_BRANCHES,
    announcements: [],
  };
  if (!db) return fallback;

  try {
    const [content, stats, testimonials, gallery, branches, announcements] = await Promise.all([
      db.from("site_content").select("key,value"),
      db.from("site_stats").select("*").order("sort_order"),
      db.from("testimonials").select("*").eq("is_visible", true).order("sort_order"),
      db.from("gallery_items").select("*").order("sort_order"),
      db.from("branches").select("*").order("sort_order"),
      db.from("announcements").select("*").eq("is_active", true).order("created_at", { ascending: false }),
    ]);

    const byKey = new Map((content.data ?? []).map((r) => [r.key as string, r.value]));
    // Use the defaults only when the query failed; an empty table means the admin removed everything.
    const rows = <T,>(r: { data: T[] | null }, def: T[]) => r.data ?? def;

    return {
      hero: { ...DEFAULT_HERO, ...(byKey.get("hero") as Partial<HeroContent> | undefined) },
      nurseryPrograms: (byKey.get("nursery_programs") as Program[] | undefined) ?? DEFAULT_NURSERY_PROGRAMS,
      classPrograms: (byKey.get("class_programs") as Program[] | undefined) ?? DEFAULT_CLASS_PROGRAMS,
      faq: (byKey.get("faq") as Program[] | undefined) ?? DEFAULT_FAQ,
      social: { ...DEFAULT_SOCIAL, ...(byKey.get("social") as Partial<Social> | undefined) },
      images: (byKey.get("images") as SiteImages | undefined) ?? {},
      stats: rows<SiteStat>(stats, DEFAULT_STATS),
      testimonials: (testimonials.data as Testimonial[] | null) ?? DEFAULT_TESTIMONIALS,
      gallery: rows<GalleryItem>(gallery, DEFAULT_GALLERY),
      branches: rows<Branch>(branches, DEFAULT_BRANCHES),
      announcements: (announcements.data as Announcement[] | null) ?? [],
    };
  } catch {
    return fallback;
  }
}
