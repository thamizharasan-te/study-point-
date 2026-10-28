"use server";

import { back, field, refreshSite, requireAdmin } from "@/lib/admin";
import type { SiteImages } from "@/lib/types";

const PATH = "/admin/applications";
const STATUSES = ["new", "contacted", "accepted", "declined"];
const BUCKET_MARK = "/storage/v1/object/public/forms/";

export async function setApplicationStatus(fd: FormData) {
  const { supabase } = await requireAdmin();
  const status = field(fd, "status");
  if (!STATUSES.includes(status)) back(PATH, { error: "Unknown status." });
  const { error } = await supabase.from("applications").update({ status }).eq("id", field(fd, "id"));
  if (error) back(PATH, { error: "Could not update. Please try again." });
  back(PATH, { saved: "Status updated." });
}

export async function saveApplicationNote(fd: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("applications").update({ admin_note: field(fd, "note").slice(0, 1000) || null }).eq("id", field(fd, "id"));
  if (error) back(PATH, { error: "Could not save the note. Please try again." });
  back(PATH, { saved: "Note saved." });
}

/** Deletes the application and its documents. */
export async function deleteApplication(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = field(fd, "id");
  const { data } = await supabase.from("applications").select("photo_path,birth_cert_path,other_doc_path").eq("id", id).maybeSingle();
  const files = [data?.photo_path, data?.birth_cert_path, data?.other_doc_path].filter((p): p is string => Boolean(p));
  if (files.length) await supabase.storage.from("applications").remove(files);
  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) back(PATH, { error: "Could not delete. Please try again." });
  back(PATH, { saved: "Application deleted." });
}

/** Called by the browser after the printable PDF is in Storage. */
export async function setApplicationPdf(input: { url: string }): Promise<{ ok: true } | { ok: false; error: string }> {
  const { supabase } = await requireAdmin();
  if (!input.url.includes(BUCKET_MARK) || !/^https?:\/\//.test(input.url)) return { ok: false, error: "Invalid file address." };
  const { data } = await supabase.from("site_content").select("value").eq("key", "images").maybeSingle();
  const images = { ...((data?.value as SiteImages | undefined) ?? {}), applicationPdf: input.url };
  const { error } = await supabase.from("site_content").upsert({ key: "images", value: images });
  if (error) return { ok: false, error: "Could not save the file." };
  refreshSite();
  return { ok: true };
}

export async function removeApplicationPdf() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_content").select("value").eq("key", "images").maybeSingle();
  const images = { ...((data?.value as SiteImages | undefined) ?? {}) };
  delete images.applicationPdf;
  const { error } = await supabase.from("site_content").upsert({ key: "images", value: images });
  if (error) back(PATH, { error: "Could not remove the file. Please try again." });
  await supabase.storage.from("forms").remove(["application-form.pdf"]);
  refreshSite();
  back(PATH, { saved: "The printable form was removed from the website." });
}
