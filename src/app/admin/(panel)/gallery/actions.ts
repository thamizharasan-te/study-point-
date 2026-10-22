"use server";

import { back, field, refreshSite, requireAdmin } from "@/lib/admin";

/** Called by the browser uploader after the file itself is in Storage. */
export async function addGalleryItem(input: { image_url: string; storage_path: string; album: string; alt: string }): Promise<{ ok: true } | { ok: false; error: string }> {
  const { supabase } = await requireAdmin();
  const { data: last } = await supabase.from("gallery_items").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const { error } = await supabase.from("gallery_items").insert({
    image_url: input.image_url,
    storage_path: input.storage_path,
    album: input.album.slice(0, 40),
    alt: input.alt.slice(0, 140),
    sort_order: (last?.sort_order ?? 0) + 1,
    is_sample: false,
  });
  if (error) return { ok: false, error: "Could not save the photo details." };
  refreshSite();
  return { ok: true };
}

export async function updateGalleryItem(fd: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("gallery_items")
    .update({ alt: field(fd, "alt").slice(0, 140), album: field(fd, "album").slice(0, 40) || "General" })
    .eq("id", field(fd, "id"));
  if (error) back("/admin/gallery", { error: "Could not save. Please try again." });
  refreshSite();
  back("/admin/gallery", { saved: "Photo details saved." });
}

/** Move a photo one place earlier/later by swapping positions, then renumbering 1..n. */
export async function moveGalleryItem(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = field(fd, "id");
  const dir = field(fd, "dir") === "up" ? -1 : 1;
  const { data } = await supabase.from("gallery_items").select("id, sort_order").order("sort_order").order("created_at");
  const list = data ?? [];
  const i = list.findIndex((g) => g.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) back("/admin/gallery", {});
  [list[i], list[j]] = [list[j], list[i]];
  const results = await Promise.all(
    list.map((g, idx) => (g.sort_order === idx + 1 ? null : supabase.from("gallery_items").update({ sort_order: idx + 1 }).eq("id", g.id))),
  );
  if (results.some((r) => r?.error)) back("/admin/gallery", { error: "Could not reorder. Please try again." });
  refreshSite();
  back("/admin/gallery", {});
}

export async function deleteGalleryItem(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = field(fd, "id");
  const { data: item } = await supabase.from("gallery_items").select("storage_path").eq("id", id).maybeSingle();
  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) back("/admin/gallery", { error: "Could not delete. Please try again." });
  if (item?.storage_path) await supabase.storage.from("gallery").remove([item.storage_path]);
  refreshSite();
  back("/admin/gallery", { saved: "Photo deleted." });
}
