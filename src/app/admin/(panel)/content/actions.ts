"use server";

import { back, field, refreshSite, requireAdmin } from "@/lib/admin";
import { DEFAULT_THEME_ID, THEMES } from "@/lib/themes";
import type { Program, SiteImages } from "@/lib/types";

const PATH = "/admin/content";

export async function saveHero(fd: FormData) {
  const { supabase } = await requireAdmin();
  const value = {
    eyebrow: field(fd, "eyebrow").slice(0, 60),
    line1: field(fd, "line1").slice(0, 40),
    line2: field(fd, "line2").slice(0, 40),
    line3: field(fd, "line3").slice(0, 40),
    subtitle: field(fd, "subtitle").slice(0, 240),
  };
  if (!value.line1 || !value.line2 || !value.line3) back(PATH, { error: "All three heading lines are needed." });
  // Optional Tamil version (only the boxes that were filled in).
  const ta: Record<string, string> = {};
  for (const [k, max] of [["eyebrow", 80], ["line1", 60], ["line2", 60], ["line3", 60], ["subtitle", 300]] as const) {
    const v = field(fd, `ta_${k}`).slice(0, max);
    if (v) ta[k] = v;
  }
  const { error } = await supabase.from("site_content").upsert({ key: "hero", value: Object.keys(ta).length ? { ...value, ta } : value });
  if (error) back(PATH, { error: "Could not save. Please try again." });
  refreshSite();
  back(PATH, { saved: "Home page heading saved." });
}

export async function savePrograms(fd: FormData) {
  const { supabase } = await requireAdmin();
  const key = field(fd, "key");
  if (!["nursery_programs", "class_programs", "faq"].includes(key)) back(PATH, { error: "Unknown list." });
  const isFaq = key === "faq";

  let list: Program[] = [];
  try {
    list = (JSON.parse(field(fd, "programs")) as Program[])
      .map((p) => {
        const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
        const item: Program = { title: clean(p.title, isFaq ? 120 : 40), description: clean(p.description, isFaq ? 600 : 200) };
        // Optional Tamil version; empty boxes are not stored.
        const tt = clean(p.title_ta, isFaq ? 160 : 60);
        const td = clean(p.description_ta, isFaq ? 600 : 200);
        if (tt) item.title_ta = tt;
        if (td) item.description_ta = td;
        return item;
      })
      .filter((p) => p.title);
  } catch {
    back(PATH, { error: "Could not read the list. Please try again." });
  }
  if (!list.length) back(PATH, { error: "Keep at least one item in the list." });

  const { error } = await supabase.from("site_content").upsert({ key, value: list });
  if (error) back(PATH, { error: "Could not save. Please try again." });
  refreshSite();
  back(PATH, { saved: "List saved." });
}

/** Social media links. Empty = not shown on the website. */
export async function saveSocial(fd: FormData) {
  const { supabase } = await requireAdmin();
  const value: Record<string, string> = {};
  for (const k of ["facebook", "instagram", "youtube", "tiktok"]) {
    const url = field(fd, k).slice(0, 300);
    if (url && !/^https:\/\//i.test(url)) back(PATH, { error: "Social media links must start with https://" });
    value[k] = url;
  }
  const { error } = await supabase.from("site_content").upsert({ key: "social", value });
  if (error) back(PATH, { error: "Could not save. Please try again." });
  refreshSite();
  back(PATH, { saved: "Social media links saved." });
}

/** Website colour theme. Stored with the picture addresses (same block), keeping everything else in it. */
export async function saveTheme(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = field(fd, "theme");
  if (!THEMES.some((t) => t.id === id)) back(PATH, { error: "Please pick one of the themes." });
  const { data } = await supabase.from("site_content").select("value").eq("key", "images").maybeSingle();
  const images = { ...((data?.value as SiteImages | undefined) ?? {}) } as SiteImages & { headerColor?: string };
  delete images.headerColor; // from the earlier header-colour option
  if (id === DEFAULT_THEME_ID) delete images.theme;
  else images.theme = id;
  const { error } = await supabase.from("site_content").upsert({ key: "images", value: images });
  if (error) back(PATH, { error: "Could not save. Please try again." });
  refreshSite();
  back(PATH, { saved: "Theme saved. The whole website now uses it." });
}
