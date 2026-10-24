import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "./supabase/server";

/**
 * Every admin server action and page starts with this. It re-checks that the
 * caller is signed in AND on the admin allow-list, even though the middleware
 * already did — so a mistake in one layer can't expose the admin tools.
 */
export async function requireAdmin() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  if (!email) redirect("/admin/login");

  const { data: row } = await supabase.from("admin_users").select("email").eq("email", email).maybeSingle();
  if (!row) redirect("/admin/login?error=not-allowed");

  return { supabase, email };
}

/** Make public pages pick up admin changes immediately. */
export const refreshSite = () => revalidatePath("/", "layout");

/** Redirect back to an admin page with a "Saved" or error banner. */
export function back(path: string, flash: { saved?: string; error?: string }): never {
  const q = new URLSearchParams();
  if (flash.saved) q.set("saved", flash.saved);
  if (flash.error) q.set("error", flash.error);
  redirect(`${path}?${q.toString()}`);
}

/** Read a trimmed string field from a form. */
export const field = (fd: FormData, name: string) => String(fd.get(name) ?? "").trim();

/**
 * True when a database column exists. The Tamil columns are added by re-running
 * supabase/schema.sql, so the admin hides the Tamil boxes until that is done.
 */
export async function hasColumn(supabase: Awaited<ReturnType<typeof createServerSupabase>>, table: string, column: string) {
  const { error } = await supabase.from(table).select(column).limit(1);
  return !error;
}
