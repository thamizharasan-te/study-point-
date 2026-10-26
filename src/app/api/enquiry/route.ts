import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getDict } from "@/lib/i18n";
import { langOf, parseEnquiry } from "@/lib/validation";

// Spam limits: per visitor (hashed IP) — max 8 enquiries per hour, 25 per day (generous, because many phones on one mobile network share an address).
const LIMIT_PER_HOUR = 8;
const LIMIT_PER_DAY = 25;

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: getDict("en").form.errors.invalid }, { status: 400 });
  }
  const errors = getDict(langOf(body)).form.errors;

  // Honeypot: real people never see/fill this hidden field, bots usually do.
  // Pretend success so bots get no signal that they were caught.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const parsed = parseEnquiry(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const db = createServiceClient();
  if (!db) {
    return NextResponse.json(
      { error: errors.unavailable },
      { status: 503 },
    );
  }

  // Only a salted hash of the IP is stored — enough to rate-limit, not to identify.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const salt = process.env.ENQUIRY_IP_SALT ?? "study-point";
  const ipHash = createHash("sha256").update(`${salt}:${ip}`).digest("hex");

  const since = (ms: number) => new Date(Date.now() - ms).toISOString();
  const [hour, day] = await Promise.all([
    db.from("enquiries").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since(3_600_000)),
    db.from("enquiries").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since(86_400_000)),
  ]);
  if ((hour.count ?? 0) >= LIMIT_PER_HOUR || (day.count ?? 0) >= LIMIT_PER_DAY) {
    return NextResponse.json(
      { error: errors.tooMany },
      { status: 429 },
    );
  }

  const { error } = await db.from("enquiries").insert({ ...parsed.value, ip_hash: ipHash });
  if (error) {
    console.error("enquiry insert failed", error.message);
    return NextResponse.json({ error: errors.generic }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
