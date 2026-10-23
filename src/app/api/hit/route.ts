import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

// Looks like a robot, a link previewer or a script rather than a person.
const BOT = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|curl|wget|python|node-fetch|axios|monitor|uptime/i;

/**
 * Privacy-friendly page-view counter (shown in /admin → Visitors).
 * Stores no IP and sets no cookie: the "visitor" is a salted hash of
 * IP + browser + day, so it cannot identify anyone or be followed across days.
 */
export async function POST(request: NextRequest) {
  const done = () => new NextResponse(null, { status: 204 });
  try {
    const ua = request.headers.get("user-agent") ?? "";
    if (!ua || BOT.test(ua)) return done();

    // Don't count the owner while signed in to /admin.
    if (request.cookies.getAll().some((c) => /^sb-.*-auth-token/.test(c.name))) return done();

    const body = (await request.json().catch(() => ({}))) as { path?: unknown; referrer?: unknown };
    const path = typeof body.path === "string" ? body.path.split("?")[0].slice(0, 200) : "";
    if (!path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) return done();

    const db = createServiceClient();
    if (!db) return done();

    // Where did they come from? Keep only the website's host name.
    let source: string | null = null;
    if (typeof body.referrer === "string" && body.referrer) {
      try {
        const host = new URL(body.referrer).hostname.replace(/^www\./, "");
        if (host && host !== request.nextUrl.hostname.replace(/^www\./, "")) source = host.slice(0, 80);
      } catch {
        // ignore a malformed referrer
      }
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const day = new Date().toISOString().slice(0, 10);
    const salt = process.env.ENQUIRY_IP_SALT ?? "study-point";
    const visitor = createHash("sha256").update(`${salt}:${ip}:${ua}:${day}`).digest("hex").slice(0, 32);
    const device = /Mobi|Android|iPhone|iPad/i.test(ua) ? "mobile" : "desktop";

    await db.from("page_views").insert({ path, visitor, device, source });
  } catch {
    // Counting must never break the website.
  }
  return done();
}
