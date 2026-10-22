import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

/**
 * Cookie-less client for reading public content. Because it never touches
 * cookies, pages that use it can be statically generated and revalidated.
 * Row level security only lets it read published/visible rows.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured()) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
