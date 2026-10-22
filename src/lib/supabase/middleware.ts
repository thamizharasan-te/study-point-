import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

/**
 * Guards every /admin page.
 *  1. Refreshes the Supabase session cookie.
 *  2. Requires a signed-in user.
 *  3. Requires that user's email to be in the `admin_users` allow-list.
 * The admin layout and every server action repeat the check (defence in depth).
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

  const { data } = await supabase.auth.getUser();
  const email = data.user?.email;

  let allowed = false;
  if (email) {
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
