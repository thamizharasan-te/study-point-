"use server";

import { back, field, refreshSite, requireAdmin } from "@/lib/admin";

const PATH = "/admin/testimonials";

function read(fd: FormData) {
  return {
    quote: field(fd, "quote").slice(0, 600),
    author: field(fd, "author").slice(0, 80) || "Parent",
    is_visible: fd.get("is_visible") === "on",
    // Saving a comment means the client has reviewed it; "confirmed" removes the Sample tag.
    is_placeholder: fd.get("confirmed") !== "on",
  };
}

export async function saveTestimonial(fd: FormData) {
  const { supabase } = await requireAdmin();
  const data = read(fd);
  if (!data.quote) back(PATH, { error: "Please type the parent's comment." });
  const id = field(fd, "id");
  const res = id
    ? await supabase.from("testimonials").update(data).eq("id", id)
    : await supabase.from("testimonials").insert({ ...data, sort_order: Date.now() % 1_000_000_000 });
  if (res.error) back(PATH, { error: "Could not save. Please try again." });
  refreshSite();
  back(PATH, { saved: id ? "Comment saved." : "Comment added." });
}

export async function toggleTestimonial(fd: FormData) {
  const { supabase } = await requireAdmin();
  const show = field(fd, "show") === "true";
  const { error } = await supabase.from("testimonials").update({ is_visible: show }).eq("id", field(fd, "id"));
  if (error) back(PATH, { error: "Could not update. Please try again." });
  refreshSite();
  back(PATH, { saved: show ? "Comment is now shown on the website." : "Comment is now hidden." });
}

export async function deleteTestimonial(fd: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("testimonials").delete().eq("id", field(fd, "id"));
  if (error) back(PATH, { error: "Could not delete. Please try again." });
  refreshSite();
  back(PATH, { saved: "Comment deleted." });
}
