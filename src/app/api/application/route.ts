import { createHash, randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getDict } from "@/lib/i18n";
import { DOC_KINDS, MAX_FILE_BYTES, MAX_TOTAL_BYTES, langOfForm, parseApplication, sniffFile, type DocKind } from "@/lib/application";

export const runtime = "nodejs";

// Spam limits per visitor (hashed IP): applications are rare, so these are low.
const LIMIT_PER_HOUR = 4;
const LIMIT_PER_DAY = 10;
const BUCKET = "applications"; // private bucket (supabase/storage.sql)

export async function POST(request: NextRequest) {
  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return NextResponse.json({ error: getDict("en").apply.errors.generic }, { status: 400 });
  }
  const errors = getDict(langOfForm(fd)).apply.errors;

  // Honeypot: people never see this field, bots usually fill it. Pretend success.
  const trap = fd.get("website");
  if (typeof trap === "string" && trap.trim() !== "") return NextResponse.json({ ok: true });

  const parsed = parseApplication(fd);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  // Documents: check size and real file type before touching storage.
  const docs: { kind: DocKind; bytes: Uint8Array; mime: string; ext: string }[] = [];
  let total = 0;
  for (const { kind, required, pdf } of DOC_KINDS) {
    const f = fd.get(kind);
    if (!(f instanceof File) || f.size === 0) {
      if (required) return NextResponse.json({ error: errors.file }, { status: 400 });
      continue;
    }
    if (f.size > MAX_FILE_BYTES) return NextResponse.json({ error: errors.tooBig }, { status: 400 });
    const bytes = new Uint8Array(await f.arrayBuffer());
    const type = sniffFile(bytes);
    if (!type || (type.mime === "application/pdf" && !pdf)) return NextResponse.json({ error: errors.file }, { status: 400 });
    total += f.size;
    docs.push({ kind, bytes, mime: type.mime, ext: type.ext });
  }
  if (total > MAX_TOTAL_BYTES) return NextResponse.json({ error: errors.tooBig }, { status: 400 });

  const db = createServiceClient();
  if (!db) return NextResponse.json({ error: errors.unavailable }, { status: 503 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = createHash("sha256").update(`${process.env.ENQUIRY_IP_SALT ?? "study-point"}:${ip}`).digest("hex");
  const since = (ms: number) => new Date(Date.now() - ms).toISOString();
  const [hour, day] = await Promise.all([
    db.from("applications").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since(3_600_000)),
    db.from("applications").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since(86_400_000)),
  ]);
  if ((hour.count ?? 0) >= LIMIT_PER_HOUR || (day.count ?? 0) >= LIMIT_PER_DAY) return NextResponse.json({ error: errors.tooMany }, { status: 429 });

  // Save the files, then the row; if anything fails, remove what was saved.
  const folder = randomUUID();
  const paths: Partial<Record<DocKind, string>> = {};
  for (const d of docs) {
    const path = `${folder}/${d.kind}.${d.ext}`;
    const { error } = await db.storage.from(BUCKET).upload(path, d.bytes, { contentType: d.mime, upsert: false });
    if (error) {
      console.error("application upload failed", error.message);
      await db.storage.from(BUCKET).remove(Object.values(paths));
      return NextResponse.json({ error: errors.generic }, { status: 500 });
    }
    paths[d.kind] = path;
  }
  const v = parsed.value;
  const n = (x: string) => x || null;
  const { error } = await db.from("applications").insert({
    program: v.program,
    branch: v.branch,
    child_first_name: v.first_name,
    child_last_name: n(v.last_name),
    child_name: `${v.first_name} ${v.last_name}`.trim(),
    child_dob: v.dob,
    child_gender: v.gender,
    gs_division: n(v.gs_division),
    previous_school: n(v.school),
    mother_name: n(v.mother.name),
    mother_address: n(v.mother.address),
    mother_phone: n(v.mother.phone),
    mother_occupation: n(v.mother.occupation),
    mother_office_phone: n(v.mother.office_phone),
    mother_email: n(v.mother.email),
    father_name: n(v.father.name),
    father_address: n(v.father.address),
    father_phone: n(v.father.phone),
    father_occupation: n(v.father.occupation),
    father_office_phone: n(v.father.office_phone),
    father_email: n(v.father.email),
    emergency_name: n(v.emergency_name),
    emergency_relationship: n(v.emergency_relationship),
    emergency_phone: n(v.emergency_phone),
    photo_path: paths.photo ?? null,
    birth_cert_path: paths.birth_cert ?? null,
    consent: true,
    ip_hash: ipHash,
  });
  if (error) {
    console.error("application insert failed", error.message);
    await db.storage.from(BUCKET).remove(Object.values(paths));
    return NextResponse.json({ error: errors.generic }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
