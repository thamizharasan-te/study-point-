"use server";

import { back, field, refreshSite, requireAdmin } from "@/lib/admin";

const KEYS = ["children", "years", "branches", "satisfaction"];

export async function saveStats(fd: FormData) {
  const { supabase } = await requireAdmin();
  const rows = KEYS.map((key, i) => ({
    key,
    label: field(fd, `label_${key}`).slice(0, 40),
    value: field(fd, `value_${key}`).slice(0, 20),
    sort_order: i + 1,
    is_placeholder: fd.get(`confirmed_${key}`) !== "on",
  }));
  if (rows.some((r) => !r.label || !r.value)) back("/admin/stats", { error: "Every number needs a label and a value." });
  const { error } = await supabase.from("site_stats").upsert(rows);
  if (error) back("/admin/stats", { error: "Could not save. Please try again." });
  refreshSite();
  back("/admin/stats", { saved: "Numbers saved." });
}
