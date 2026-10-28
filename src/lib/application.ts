import { getDict, isLang, type Lang } from "./i18n";

/** Admission application: shared limits and validation (used by the API route; the form mirrors them). */

export const APPLICATION_PROGRAMS = ["Kindergarten (3–5 years)", "Study Point Classes"] as const;
export const MAX_FILE_BYTES = 2 * 1024 * 1024; // per document
export const MAX_TOTAL_BYTES = 4 * 1024 * 1024; // all documents together (the host limits a request to ~4.5 MB)

export type DocKind = "photo" | "birth_cert";
export const DOC_KINDS: { kind: DocKind; required: boolean; pdf: boolean }[] = [
  { kind: "photo", required: true, pdf: false },
  { kind: "birth_cert", required: false, pdf: true },
];

export interface ParentInput { name: string; address: string; phone: string; occupation: string; office_phone: string; email: string }
export interface ApplicationInput {
  program: string;
  branch: string;
  first_name: string;
  last_name: string;
  dob: string;
  gender: "Male" | "Female";
  gs_division: string;
  school: string;
  mother: ParentInput;
  father: ParentInput;
  emergency_name: string;
  emergency_relationship: string;
  emergency_phone: string;
}

const clean = (v: FormDataEntryValue | null, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const digits = (s: string) => s.replace(/\D/g, "");
const validPhone = (s: string) => digits(s).length >= 9 && digits(s).length <= 15 && /^[\d\s+()-]+$/.test(s);

export function langOfForm(fd: FormData): Lang {
  const l = fd.get("lang");
  return typeof l === "string" && isLang(l) ? l : "en";
}

/** What kind of file this really is, judged from its first bytes (the browser's claim can be faked). */
export function sniffFile(bytes: Uint8Array): { mime: string; ext: string } | null {
  const b = bytes;
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  if (b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { mime: "image/png", ext: "png" };
  if (b.length > 12 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return { mime: "image/webp", ext: "webp" };
  if (b.length > 5 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return { mime: "application/pdf", ext: "pdf" };
  return null;
}

const parent = (fd: FormData, who: "mother" | "father"): ParentInput => ({
  name: clean(fd.get(`${who}_name`), 100),
  address: clean(fd.get(`${who}_address`), 300),
  phone: clean(fd.get(`${who}_phone`), 30),
  occupation: clean(fd.get(`${who}_occupation`), 100),
  office_phone: clean(fd.get(`${who}_office_phone`), 30),
  email: clean(fd.get(`${who}_email`), 120),
});

export function parseApplication(fd: FormData): { ok: true; value: ApplicationInput } | { ok: false; error: string } {
  const e = getDict(langOfForm(fd)).apply.errors;
  const gender = clean(fd.get("gender"), 10);
  const v: ApplicationInput = {
    program: clean(fd.get("program"), 60),
    branch: clean(fd.get("branch"), 60),
    first_name: clean(fd.get("first_name"), 60),
    last_name: clean(fd.get("last_name"), 60),
    dob: clean(fd.get("dob"), 10),
    gender: gender === "Female" ? "Female" : "Male",
    gs_division: clean(fd.get("gs_division"), 100),
    school: clean(fd.get("school"), 120),
    mother: parent(fd, "mother"),
    father: parent(fd, "father"),
    emergency_name: clean(fd.get("emergency_name"), 100),
    emergency_relationship: clean(fd.get("emergency_relationship"), 60),
    emergency_phone: clean(fd.get("emergency_phone"), 30),
  };
  if (!v.first_name || !v.branch || !(APPLICATION_PROGRAMS as readonly string[]).includes(v.program) || !["Male", "Female"].includes(gender)) return { ok: false, error: e.required };
  if (!v.emergency_name || !v.emergency_phone) return { ok: false, error: e.required };
  // At least one parent with a name and a phone number.
  const hasParent = (p: ParentInput) => p.name.length >= 2 && validPhone(p.phone);
  if (!hasParent(v.mother) && !hasParent(v.father)) return { ok: false, error: e.parent };
  for (const p of [v.mother, v.father]) {
    if (p.phone && !validPhone(p.phone)) return { ok: false, error: e.phone };
    if (p.office_phone && !validPhone(p.office_phone)) return { ok: false, error: e.phone };
    if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) return { ok: false, error: e.required };
  }
  if (!validPhone(v.emergency_phone)) return { ok: false, error: e.phone };
  const dob = /^\d{4}-\d{2}-\d{2}$/.test(v.dob) ? new Date(`${v.dob}T00:00:00Z`) : null;
  const years = dob ? (Date.now() - dob.getTime()) / (365.25 * 86_400_000) : -1;
  if (!dob || Number.isNaN(dob.getTime()) || years < 0.5 || years > 21) return { ok: false, error: e.dob };
  if (fd.get("consent") !== "on") return { ok: false, error: e.consent };
  return { ok: true, value: v };
}
