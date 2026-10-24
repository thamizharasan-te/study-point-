"use server";

import { back, field, refreshSite, requireAdmin } from "@/lib/admin";
import type { ImageSlot, SiteImages } from "@/lib/types";

const SLOTS: ImageSlot[] = ["hero", "nursery", "classes", "why", "about", "logo", "logoFull"];
const BUCKET_MARK = "/storage/v1/object/public/gallery/";

type Supabase = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

async function loadImages(supabase: Supabase): Promise<SiteImages> {
  const { data } = await supabase.from("site_content").select("value").eq("key", "images").maybeSingle();
  return (data?.value as SiteImages | undefined) ?? {};
}

/** Delete a replaced picture from Storage (only files we uploaded under site/). */
async function removeOld(supabase: Supabase, url?: string) {
  const i = url?.indexOf(BUCKET_MARK) ?? -1;
  if (!url || i < 0) return;
  const path = decodeURIComponent(url.slice(i + BUCKET_MARK.length));
  if (path.startsWith("site/")) await supabase.storage.from("gallery").remove([path]);
}

/** Called by the browser uploader after the file itself is in Storage. */
export async function setSiteImage(input: { slot: string; url: string }): Promise<{ ok: true } | { ok: false; error: string }> {
  const { supabase } = await requireAdmin();
  const slot = input.slot as ImageSlot;
  if (!SLOTS.includes(slot)) return { ok: false, error: "Unknown picture." };
  if (!input.url.includes(BUCKET_MARK) || !/^https?:\/\//.test(input.url)) return { ok: false, error: "Invalid picture address." };

  const images = await loadImages(supabase);
  const old = images[slot];
  const { error } = await supabase.from("site_content").upsert({ key: "images", value: { ...images, [slot]: input.url } });
  if (error) return { ok: false, error: "Could not save the picture." };
  await removeOld(supabase, old);
  refreshSite();
  return { ok: true };
}

/** Go back to the built-in illustration. */
export async function resetSiteImage(fd: FormData) {
  const { supabase } = await requireAdmin();
  const slot = field(fd, "slot") as ImageSlot;
  if (!SLOTS.includes(slot)) back("/admin/images", { error: "Unknown picture." });
  const images = await loadImages(supabase);
  const old = images[slot];
  delete images[slot];
  const { error } = await supabase.from("site_content").upsert({ key: "images", value: images });
  if (error) back("/admin/images", { error: "Could not save. Please try again." });
  await removeOld(supabase, old);
  refreshSite();
  back("/admin/images", { saved: "Picture reset to the built-in illustration." });
}
