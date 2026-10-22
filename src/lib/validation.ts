/** Shared enquiry validation (used by the API route; mirrored by the form's HTML attributes). */

export const INTERESTS = ["Nursery (3–5 years)", "Study Point Classes", "Not sure yet"] as const;

export interface EnquiryInput {
  parent_name: string;
  phone: string;
  child_name: string;
  child_age: string;
  interest: string;
  branch: string;
  message: string;
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function parseEnquiry(body: unknown): { ok: true; value: EnquiryInput } | { ok: false; error: string } {
  const b = (body ?? {}) as Record<string, unknown>;
  const value: EnquiryInput = {
    parent_name: clean(b.parent_name, 100),
    phone: clean(b.phone, 30),
    child_name: clean(b.child_name, 100),
    child_age: clean(b.child_age, 30),
    interest: clean(b.interest, 60) || "Not sure yet",
    branch: clean(b.branch, 60),
    message: clean(b.message, 1000),
  };
  if (value.parent_name.length < 2) return { ok: false, error: "Please enter your name." };
  // Accept local (07x…) and international (+94…) numbers: 9–15 digits.
  const d = value.phone.replace(/\D/g, "");
  if (d.length < 9 || d.length > 15 || !/^[\d\s+()-]+$/.test(value.phone)) {
    return { ok: false, error: "Please enter a valid phone number." };
  }
  return { ok: true, value };
}
