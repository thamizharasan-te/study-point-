"use server";

import { back, field, refreshSite, requireAdmin } from "@/lib/admin";
import type { Program } from "@/lib/types";

const PATH = "/admin/content";

export async function saveHero(fd: FormData) {
  const { supabase } = await requireAdmin();
  const value = {
    eyebrow: field(fd, "eyebrow").slice(0, 60),
    line1: field(fd, "line1").slice(0, 40),
    line2: field(fd, "line2").slice(0, 40),
    line3: field(fd, "line3").slice(0, 40),
    subtitle: field(fd, "subtitle").slice(0, 240),
  };
  if (!value.line1 || !value.line2 || !value.line3) back(PATH, { error: "All three heading lines are needed." });
  const { error } = await supabase.from("site_content").upsert({ key: "hero", value });
  if (error) back(PATH, { error: "Could not save. Please try again." });
  refreshSite();
  back(PATH, { saved: "Home page heading saved." });
}

export async function savePrograms(fd: FormData) {
  const { supabase } = await requireAdmin();
  const key = field(fd, "key");
  if (key !== "nursery_programs" && key !== "class_programs") back(PATH, { error: "Unknown list." });

  let list: Program[] = [];
  try {
    list = (JSON.parse(field(fd, "programs")) as Program[])
      .map((p) => ({ title: String(p.title ?? "").trim().slice(0, 40), description: String(p.description ?? "").trim().slice(0, 200) }))
      .filter((p) => p.title);
  } catch {
    back(PATH, { error: "Could not read the list. Please try again." });
  }
  if (!list.length) back(PATH, { error: "Keep at least one item in the list." });

  const { error } = await supabase.from("site_content").upsert({ key, value: list });
  if (error) back(PATH, { error: "Could not save. Please try again." });
  refreshSite();
  back(PATH, { saved: "List saved." });
}
