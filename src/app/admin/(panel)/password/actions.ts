"use server";

import { back, requireAdmin } from "@/lib/admin";

export async function changePassword(fd: FormData) {
  const { supabase } = await requireAdmin();
  const password = String(fd.get("password") ?? "");
  const confirm = String(fd.get("confirm") ?? "");
  if (password.length < 8) back("/admin/password", { error: "Password must be at least 8 characters." });
  if (password !== confirm) back("/admin/password", { error: "The two passwords do not match." });
  const { error } = await supabase.auth.updateUser({ password });
  if (error) back("/admin/password", { error: error.message });
  back("/admin/password", { saved: "Your password has been changed." });
}

