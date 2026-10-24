import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

/**
 * Guards every /admin page.
 *  1. Refreshes the Supabase session cookie.
 *  2. Requires a signed-in user.
 *  3. The `admin_users` allow-list is enforced by requireAdmin() in the admin layout, pages and actions.
 */
export async function guardAdmin(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";

  if (!isSupabaseConfigured()) {
    // Show the "not configured" notice on the login page only.
    return isLogin ? NextResponse.next() : NextResponse.redirect(new URL("/admin/login", request.url));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(list) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getClaims() refreshes an expired session and verifies the token locally when possible, so a normal
  // admin click costs no extra trip to Supabase here. The allow-list is re-checked by the admin layout,
  // every page and every action (requireAdmin); it is only looked up here for the sign-in page redirect.
  const { data } = await supabase.auth.getClaims();
  const email = typeof data?.claims?.email === "string" ? data.claims.email : undefined;

  let allowed = Boolean(email);
  if (email && isLogin) {
    // RLS lets a user read only their own allow-list row.
    const { data: row } = await supabase.from("admin_users").select("email").eq("email", email.toLowerCase()).maybeSingle();
    allowed = Boolean(row);
  }

  if (!allowed && !isLogin) {
    const url = new URL("/admin/login", request.url);
    if (email) url.searchParams.set("error", "not-allowed");
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }
  if (allowed && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return response;
}
