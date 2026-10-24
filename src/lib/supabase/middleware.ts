import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

/**
 * Guards every /admin page.
 *  1. Refreshes the Supabase session cookie.
 *  2. Requires a signed-in user.
 *  3. The allow-list is enforced by requireAdmin() in the admin layout, pages and actions.
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

  // getSession() only reads the cookie (and refreshes it when it has expired), so a normal admin click costs
  // no trip to Supabase here. This is just the quick "are you signed in" gate: the real check (token verified
  // by the database + allow-list) is requireAdmin() in the admin layout, every page and every action.
  const { data } = await supabase.auth.getSession();
  const signedIn = Boolean(data.session);

  let allowed = signedIn;
  if (signedIn && isLogin) {
    // Only the sign-in page needs the full answer, to send an admin straight to the panel.
    const { data: ok } = await supabase.rpc("is_admin");
    allowed = ok === true;
  }

  if (!allowed && !isLogin) {
    const url = new URL("/admin/login", request.url);
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }
  if (allowed && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return response;
}
