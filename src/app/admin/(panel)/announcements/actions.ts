"use server";

import { back, field, refreshSite, requireAdmin } from "@/lib/admin";

const PATH = "/admin/announcements";

export async function addAnnouncement(fd: FormData) {
  const { supabase } = await requireAdmin();
  const text = field(fd, "text").slice(0, 200);
  if (!text) back(PATH, { error: "Please type the announcement." });
  const { error } = await supabase.from("announcements").insert({ text, is_active: true });
  if (error) back(PATH, { error: "Could not save. Please try again." });
  refreshSite();
  back(PATH, { saved: "Announcement is now live on the website." });
}

export async function toggleAnnouncement(fd: FormData) {
  const { supabase } = await requireAdmin();
  const active = field(fd, "active") === "true";
  const { error } = await supabase.from("announcements").update({ is_active: active }).eq("id", field(fd, "id"));
  if (error) back(PATH, { error: "Could not update. Please try again." });
  refreshSite();
  back(PATH, { saved: active ? "Announcement is live." : "Announcement is hidden." });
}

export async function deleteAnnouncement(fd: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("announcements").delete().eq("id", field(fd, "id"));
  if (error) back(PATH, { error: "Could not delete. Please try again." });
  refreshSite();
  back(PATH, { saved: "Announcement deleted." });
}
