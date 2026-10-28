import { getDict, isLang, type Lang } from "./i18n";

/** Admission application: shared limits and validation (used by the API route; the form mirrors them). */

export const APPLICATION_PROGRAMS = ["Kindergarten (3–5 years)", "Study Point Classes"] as const;
export const MAX_FILE_BYTES = 2 * 1024 * 1024; // per document
export const MAX_TOTAL_BYTES = 4 * 1024 * 1024; // all documents together (the host limits a request to ~4.5 MB)

export type DocKind = "photo" | "birth_cert" | "other_doc";
export const DOC_KINDS: { kind: DocKind; required: boolean; pdf: boolean }[] = [
  { kind: "photo", required: true, pdf: false },
  { kind: "birth_cert", required: true, pdf: true },
  { kind: "other_doc", required: false, pdf: true },
];

export interface ApplicationInput {
  program: string;
  branch: string;
  child_name: string;
  child_dob: string;
  child_gender: string;
  previous_school: string;
  health_notes: string;
  parent_name: string;
  relationship: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  emergency_name: string;
  emergency_phone: string;
  how_heard: string;
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

export function parseApplication(fd: FormData): { ok: true; value: ApplicationInput } | { ok: false; error: string } {
  const e = getDict(langOfForm(fd)).apply.errors;
  const v: ApplicationInput = {
    program: clean(fd.get("program"), 60),
    branch: clean(fd.get("branch"), 60),
    child_name: clean(fd.get("child_name"), 100),
    child_dob: clean(fd.get("child_dob"), 10),
    child_gender: clean(fd.get("child_gender"), 30),
    previous_school: clean(fd.get("previous_school"), 120),
    health_notes: clean(fd.get("health_notes"), 1000),
    parent_name: clean(fd.get("parent_name"), 100),
    relationship: clean(fd.get("relationship"), 30),
    phone: clean(fd.get("phone"), 30),
    whatsapp: clean(fd.get("whatsapp"), 30),
    email: clean(fd.get("email"), 120),
    address: clean(fd.get("address"), 300),
    emergency_name: clean(fd.get("emergency_name"), 100),
    emergency_phone: clean(fd.get("emergency_phone"), 30),
    how_heard: clean(fd.get("how_heard"), 60),
  };
  if (v.child_name.length < 2 || v.parent_name.length < 2 || !v.branch || !(APPLICATION_PROGRAMS as readonly string[]).includes(v.program)) return { ok: false, error: e.required };
  if (!validPhone(v.phone) || (v.whatsapp && !validPhone(v.whatsapp)) || (v.emergency_phone && !validPhone(v.emergency_phone))) return { ok: false, error: e.phone };
  const dob = /^\d{4}-\d{2}-\d{2}$/.test(v.child_dob) ? new Date(`${v.child_dob}T00:00:00Z`) : null;
  const now = new Date();
  const years = dob ? (now.getTime() - dob.getTime()) / (365.25 * 86_400_000) : -1;
  if (!dob || Number.isNaN(dob.getTime()) || years < 0.5 || years > 21) return { ok: false, error: e.dob };
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return { ok: false, error: e.required };
  if (fd.get("consent") !== "on") return { ok: false, error: e.consent };
  return { ok: true, value: v };
}
