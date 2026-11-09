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

/** Bulk upload: called once per group of photos after their files are already in Storage. */
export async function addGalleryItems(input: { items: { image_url: string; storage_path: string }[]; album: string; alt: string }): Promise<{ ok: true } | { ok: false; error: string }> {
  const { supabase } = await requireAdmin();
  if (!input.items.length || input.items.length > 100) return { ok: false, error: "Please add between 1 and 100 photos at a time." };
  if (input.items.some((i) => !/^https?:\/\//.test(i.image_url))) return { ok: false, error: "Invalid picture address." };
  const { data: last } = await supabase.from("gallery_items").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const start = (last?.sort_order ?? 0) + 1;
  const album = input.album.slice(0, 40) || "General";
  const { error } = await supabase.from("gallery_items").insert(
    input.items.map((i, n) => ({
      image_url: i.image_url,
      storage_path: i.storage_path,
      album,
      alt: input.alt.slice(0, 140) || `${album} photo at Study Point`,
      sort_order: start + n,
      is_sample: false,
    })),
  );
  if (error) return { ok: false, error: "Could not save the photo details." };
  refreshSite();
  return { ok: true };
}

/** The admin list is paged, so after an action go back to the page the admin was on. */
const here = (fd: FormData) => {
  const n = Number(field(fd, "page"));
  return Number.isInteger(n) && n > 1 ? `/admin/gallery?page=${n}` : "/admin/gallery";
};

/** Saves the album and descriptions of every photo on the admin page in one go (the page sends parallel lists). */
export async function saveGalleryPage(fd: FormData) {
  const { supabase } = await requireAdmin();
  const ids = fd.getAll("id").map(String);
  const albums = fd.getAll("album").map(String);
  const alts = fd.getAll("alt").map(String);
  const altsTa = fd.has("alt_ta") ? fd.getAll("alt_ta").map(String) : null; // Tamil boxes exist only after schema.sql was re-run
  if (!ids.length || ids.length > 50 || albums.length !== ids.length || alts.length !== ids.length || (altsTa && altsTa.length !== ids.length)) {
    back(here(fd), { error: "Could not save. Please reload the page and try again." });
  }
  const results = await Promise.all(
    ids.map((id, i) =>
      supabase
        .from("gallery_items")
        .update({
          alt: alts[i].trim().slice(0, 140),
          album: albums[i].trim().slice(0, 40) || "General",
          ...(altsTa ? { alt_ta: altsTa[i].trim().slice(0, 140) } : {}),
        })
        .eq("id", id),
    ),
  );
  if (results.some((r) => r.error)) back(here(fd), { error: "Could not save all the photos. Please try again." });
  refreshSite();
  back(here(fd), { saved: `Saved ${ids.length} photo${ids.length === 1 ? "" : "s"}.` });
}

/** The list is newest first (as on the website): "up" moves a photo one place towards the front. Swaps positions, then renumbers. */
export async function moveGalleryItem(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = field(fd, "id");
  const dir = field(fd, "dir") === "up" ? -1 : 1;
  const { data } = await supabase.from("gallery_items").select("id, sort_order").order("sort_order", { ascending: false }).order("created_at", { ascending: false });
  const list = data ?? [];
  const i = list.findIndex((g) => g.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) back(here(fd), {});
  [list[i], list[j]] = [list[j], list[i]];
  const results = await Promise.all(
    list.map((g, idx) => (g.sort_order === list.length - idx ? null : supabase.from("gallery_items").update({ sort_order: list.length - idx }).eq("id", g.id))),
  );
  if (results.some((r) => r?.error)) back(here(fd), { error: "Could not reorder. Please try again." });
  refreshSite();
  back(here(fd), {});
}

export async function deleteGalleryItem(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = field(fd, "id");
  const { data: item } = await supabase.from("gallery_items").select("storage_path").eq("id", id).maybeSingle();
  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) back(here(fd), { error: "Could not delete. Please try again." });
  if (item?.storage_path) await supabase.storage.from("gallery").remove([item.storage_path]);
  refreshSite();
  back(here(fd), { saved: "Photo deleted." });
}
