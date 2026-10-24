import { NextResponse, type NextRequest } from "next/server";
import { guardAdmin } from "@/lib/supabase/middleware";

/**
 * 1. /admin/* — sign-in and allow-list check.
 * 2. Public pages — English has no prefix (/about) and Tamil lives under /ta
 *    (/ta/about). Internally English pages are served from /en, so unprefixed
 *    addresses are rewritten to /en/… and /en/… is redirected to the clean URL.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) return guardAdmin(request);

  if (pathname === "/ta" || pathname.startsWith("/ta/")) return NextResponse.next();

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except API routes, Next.js internals and files with an extension (images, sitemap.xml …).
  matcher: ["/((?!api|_next|_vercel|opengraph-image|icon|.*\\..*).*)"],
};
