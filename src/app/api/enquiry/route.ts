import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { parseEnquiry } from "@/lib/validation";

// Spam limits: per visitor (hashed IP) — max 3 enquiries per hour, 8 per day.
const LIMIT_PER_HOUR = 3;
const LIMIT_PER_DAY = 8;

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

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
      { error: "Enquiries are not available right now. Please call or WhatsApp us." },
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
      { error: "You have sent several enquiries already. Please try again later or call us." },
      { status: 429 },
    );
  }

  const { error } = await db.from("enquiries").insert({ ...parsed.value, ip_hash: ipHash });
  if (error) {
    console.error("enquiry insert failed", error.message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
