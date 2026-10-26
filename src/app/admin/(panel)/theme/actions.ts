"use server";

import { back, field, refreshSite, requireAdmin } from "@/lib/admin";
import { DEFAULT_THEME_ID, THEMES } from "@/lib/themes";
import type { SiteImages } from "@/lib/types";

const PATH = "/admin/theme";

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
