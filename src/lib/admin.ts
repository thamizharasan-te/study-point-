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
/** Email inside a sign-in token, for display only (never used to decide access). */
function emailInToken(token?: string): string {
  try {
    const payload = JSON.parse(Buffer.from(token?.split(".")[1] ?? "", "base64url").toString());
    return typeof payload.email === "string" ? payload.email.toLowerCase() : "";
  } catch {
    return "";
  }
}

export const requireAdmin = cache(async () => {
  const supabase = await createServerSupabase();
  // One round trip decides everything: is_admin() runs inside the database, which has already verified the
  // sign-in token and checks the allow-list. (The old way asked Supabase Auth, then the allow-list: two trips.)
  // cache() lets the layout and the page of one request share this single check.
  const [{ data: session }, { data: allowed }] = await Promise.all([supabase.auth.getSession(), supabase.rpc("is_admin")]);
  if (!session.session) redirect("/admin/login");
  if (allowed !== true) redirect("/admin/login?error=not-allowed");

  return { supabase, email: emailInToken(session.session.access_token) };
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
