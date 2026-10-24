import "server-only";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "./supabase/server";

/**
 * Every admin server action and page starts with this. It re-checks that the
 * caller is signed in AND on the admin allow-list, even though the middleware
 * already did — so a mistake in one layer can't expose the admin tools.
 */
export const requireAdmin = cache(async () => {
  const supabase = await createServerSupabase();
  // getClaims() checks the sign-in token locally (no round trip to Supabase Auth) when the project uses
  // signing keys, and falls back to asking Supabase otherwise. cache() lets the layout and the page of the
  // same request share one check instead of each repeating it.
  const { data } = await supabase.auth.getClaims();
  const email = typeof data?.claims?.email === "string" ? data.claims.email.toLowerCase() : "";
  if (!email) redirect("/admin/login");

  const { data: row } = await supabase.from("admin_users").select("email").eq("email", email).maybeSingle();
  if (!row) redirect("/admin/login?error=not-allowed");

  return { supabase, email };
});

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
const columnsFound = new Set<string>();
export async function hasColumn(supabase: Awaited<ReturnType<typeof createServerSupabase>>, table: string, column: string) {
  const id = `${table}.${column}`;
  if (columnsFound.has(id)) return true; // columns never disappear, so skip the extra database round trip
  const { error } = await supabase.from(table).select(column).limit(1);
  if (!error) columnsFound.add(id);
  return !error;
}
