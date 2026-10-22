import type { NextRequest } from "next/server";
import { guardAdmin } from "@/lib/supabase/middleware";

export function middleware(request: NextRequest) {
  return guardAdmin(request);
}

export const config = { matcher: ["/admin/:path*"] };
