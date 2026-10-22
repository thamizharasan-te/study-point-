"use server";

import { back, field, refreshSite, requireAdmin } from "@/lib/admin";

export async function saveBranch(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = field(fd, "id");
  const phones = field(fd, "phones").split(/[\n,]+/).map((p) => p.trim()).filter(Boolean).slice(0, 4);
  const mapUrl = field(fd, "map_url");
  if (mapUrl && !/^https?:\/\//i.test(mapUrl)) back("/admin/branches", { error: "The map link must start with https://" });
  const { error } = await supabase
    .from("branches")
    .update({
      address: field(fd, "address").slice(0, 300),
      phones,
      whatsapp: field(fd, "whatsapp").slice(0, 30),
      hours: field(fd, "hours").slice(0, 200),
      map_url: mapUrl.slice(0, 1000),
      is_placeholder: fd.get("confirmed") !== "on",
    })
    .eq("id", id);
  if (error) back("/admin/branches", { error: "Could not save. Please try again." });
  refreshSite();
  back("/admin/branches", { saved: "Branch details saved." });
}
