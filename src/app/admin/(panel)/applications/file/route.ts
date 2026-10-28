import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin";

/** Opens an application document: checks the visitor is an admin, then redirects to a one-minute private link. */
export async function GET(request: NextRequest) {
  const { supabase } = await requireAdmin();
  const path = request.nextUrl.searchParams.get("p") ?? "";
  if (!/^[0-9a-f-]{36}\/(photo|birth_cert)\.(jpg|png|webp|pdf)$/.test(path)) return new NextResponse("Not found", { status: 404 });
  const { data, error } = await supabase.storage.from("applications").createSignedUrl(path, 60);
  if (error || !data?.signedUrl) return new NextResponse("File not found", { status: 404 });
  return NextResponse.redirect(data.signedUrl);
}
