"use server";

import { back, field, refreshSite, requireAdmin } from "@/lib/admin";

const STATUSES = ["new", "contacted", "joined"];

export async function setStatus(fd: FormData) {
  const { supabase } = await requireAdmin();
  const status = field(fd, "status");
  if (!STATUSES.includes(status)) back("/admin/enquiries", { error: "Unknown status." });
  const { error } = await supabase.from("enquiries").update({ status }).eq("id", field(fd, "id"));
  if (error) back("/admin/enquiries", { error: "Could not update. Please try again." });
  back("/admin/enquiries", { saved: "Status updated." });
}

export async function deleteEnquiry(fd: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("enquiries").delete().eq("id", field(fd, "id"));
  if (error) back("/admin/enquiries", { error: "Could not delete. Please try again." });
  refreshSite();
  back("/admin/enquiries", { saved: "Enquiry deleted." });
}
