"use client";

import { useRef, useState, type FormEvent } from "react";
import { FileCheck2, Loader2, Send, Upload } from "lucide-react";
import { MAX_FILE_BYTES, MAX_TOTAL_BYTES } from "@/lib/application";
import { fmt } from "@/lib/i18n";
import { compressToFit } from "@/lib/shrink-image";
import { useLang } from "./LangProvider";

type Status = "idle" | "sending" | "done" | "error";

const Field = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => (
  <div>
    <label className="label" htmlFor={id}>{label}</label>
    {children}
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <fieldset className="space-y-4 rounded-2xl border border-gray-200 p-4 sm:p-5">
    <legend className="px-2 text-lg font-extrabold text-brand-navy">{title}</legend>
    {children}
  </fieldset>
);

/** A file picker that shows the chosen file's name. */
function FilePick({ name, label, accept, required, hint }: { name: string; label: string; accept: string; required?: boolean; hint?: string }) {
  const [picked, setPicked] = useState("");
  return (
    <div>
      <span className="label">{label}</span>
      <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-brand-navy hover:border-brand-green hover:bg-brand-green-soft focus-within:ring-2 focus-within:ring-brand-navy">
        {picked ? <FileCheck2 className="h-5 w-5 shrink-0 text-brand-green" aria-hidden /> : <Upload className="h-5 w-5 shrink-0 text-brand-green" aria-hidden />}
        <span className="min-w-0 truncate">{picked || hint}</span>
        <input type="file" name={name} accept={accept} required={required} className="sr-only" onChange={(e) => setPicked(e.target.files?.[0]?.name ?? "")} />
      </label>
    </div>
  );
}

/** Admission application with the child's photo and birth certificate. Photos are shrunk in the browser first. */
export function ApplicationForm({ branches }: { branches: { value: string; label: string }[] }) {
  const { lang, t } = useLang();
  const a_ = t.apply;
  const a = a_;
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [child, setChild] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError("");
    try {
      const fd = new FormData(form);
      fd.set("lang", lang);
      // Pictures of ANY size are squeezed here until they fit (about 700 KB each), so the upload is small and
      // quick. PDFs are sent as they are (they cannot be shrunk in the browser), up to 2 MB.
      let total = 0;
      for (const key of ["photo", "birth_cert"]) {
        const f = fd.get(key);
        if (!(f instanceof File) || f.size === 0) { fd.delete(key); continue; }
        if (f.type === "application/pdf") {
          if (f.size > MAX_FILE_BYTES) throw new Error(a_.errors.pdfTooBig);
          total += f.size;
        } else {
          const out = await compressToFit(f, 700 * 1024);
          if (!out) throw new Error(a_.errors.notPicture);
          fd.set(key, out.blob, `${key}.${out.ext}`);
          total += out.blob.size;
        }
      }
      if (total > MAX_TOTAL_BYTES) throw new Error(a_.errors.tooBig);
      const res = await fetch("/api/application", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || a.errors.generic);
      setChild(`${fd.get("first_name") ?? ""} ${fd.get("last_name") ?? ""}`.trim());
      form.reset();
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : a.errors.generic);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="rounded-2xl bg-brand-green-soft p-6 text-center sm:p-8">
        <p className="font-display text-2xl font-bold text-brand-green-dark">{a.thanksTitle}</p>
        <p className="mt-2 text-brand-ink">{fmt(a.thanksText, { child })}</p>
        <button type="button" className="btn-outline mt-4" onClick={() => setStatus("idle")}>{a.another}</button>
      </div>
    );
  }

  const parentFields = (who: "mother" | "father") => (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={`${who}_name`} label={a.labels.name}><input className="input" id={`${who}_name`} name={`${who}_name`} maxLength={100} autoComplete="off" /></Field>
        <Field id={`${who}_phone`} label={a.labels.phone}><input className="input" id={`${who}_phone`} name={`${who}_phone`} type="tel" inputMode="tel" maxLength={30} placeholder="07X XXX XXXX" /></Field>
        <Field id={`${who}_occupation`} label={a.labels.occupation}><input className="input" id={`${who}_occupation`} name={`${who}_occupation`} maxLength={100} /></Field>
        <Field id={`${who}_office_phone`} label={a.labels.officePhone}><input className="input" id={`${who}_office_phone`} name={`${who}_office_phone`} type="tel" inputMode="tel" maxLength={30} /></Field>
        <Field id={`${who}_email`} label={a.labels.email}><input className="input" id={`${who}_email`} name={`${who}_email`} type="email" maxLength={120} /></Field>
      </div>
      <Field id={`${who}_address`} label={a.labels.address}><textarea className="input" id={`${who}_address`} name={`${who}_address`} rows={2} maxLength={300} /></Field>
    </>
  );

  return (
    <form ref={formRef} onSubmit={submit} className="space-y-5" encType="multipart/form-data">
      {/* Honeypot: hidden from people, tempting to bots. Must stay empty. */}
      <div className="sr-only-field" aria-hidden="true">
        <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <Section title={a.sections.programme}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="program" label={a.labels.program}>
            <select className="input" id="program" name="program" required defaultValue="">
              <option value="" disabled>{a.labels.choose}</option>
              {["Kindergarten (3–5 years)", "Study Point Classes"].map((v, i) => <option key={v} value={v}>{a.programs[i]}</option>)}
            </select>
          </Field>
          <Field id="branch" label={a.labels.branch}>
            <select className="input" id="branch" name="branch" required defaultValue="">
              <option value="" disabled>{a.labels.choose}</option>
              {branches.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      <Section title={a.sections.child}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="first_name" label={a.labels.firstName}><input className="input" id="first_name" name="first_name" required maxLength={60} autoComplete="off" /></Field>
          <Field id="last_name" label={a.labels.lastName}><input className="input" id="last_name" name="last_name" maxLength={60} autoComplete="off" /></Field>
          <Field id="dob" label={a.labels.dob}><input className="input" id="dob" name="dob" type="date" required max={today} /></Field>
          <div>
            <span className="label" id="gender-label">{a.labels.gender}</span>
            <div role="radiogroup" aria-labelledby="gender-label" className="flex gap-3">
              {["Male", "Female"].map((v, i) => (
                <label key={v} className="flex min-h-12 flex-1 cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 font-semibold text-brand-navy has-[:checked]:border-brand-green has-[:checked]:bg-brand-green-soft">
                  <input type="radio" name="gender" value={v} required className="h-5 w-5 accent-brand-green" /> {a.genders[i]}
                </label>
              ))}
            </div>
          </div>
          <Field id="gs_division" label={a.labels.gs}><input className="input" id="gs_division" name="gs_division" maxLength={100} /></Field>
          <Field id="school" label={a.labels.school}><input className="input" id="school" name="school" maxLength={120} /></Field>
        </div>
      </Section>

      <p className="rounded-xl bg-brand-navy-soft px-4 py-2 text-sm font-semibold text-brand-navy">{a.parentsNote}</p>
      <Section title={a.sections.mother}>{parentFields("mother")}</Section>
      <Section title={a.sections.father}>{parentFields("father")}</Section>

      <Section title={a.sections.emergency}>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field id="emergency_name" label={a.labels.emergencyName}><input className="input" id="emergency_name" name="emergency_name" required maxLength={100} /></Field>
          <Field id="emergency_relationship" label={a.labels.relationship}><input className="input" id="emergency_relationship" name="emergency_relationship" maxLength={60} /></Field>
          <Field id="emergency_phone" label={a.labels.emergencyPhone}><input className="input" id="emergency_phone" name="emergency_phone" type="tel" inputMode="tel" required maxLength={30} /></Field>
        </div>
      </Section>

      <Section title={a.sections.documents}>
        <p className="text-sm text-gray-600">{a.fileHelp}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <FilePick name="photo" label={a.labels.photo} accept="image/*" required hint={a.labels.choose} />
          <FilePick name="birth_cert" label={a.labels.birthCert} accept="image/*,application/pdf" hint={a.labels.choose} />
        </div>
        <label className="flex items-start gap-3 rounded-xl bg-brand-cream p-3 text-sm text-brand-ink">
          <input type="checkbox" name="consent" required className="mt-0.5 h-5 w-5 shrink-0 accent-brand-green" />
          <span>{a.consent}</span>
        </label>
      </Section>

      {status === "error" && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

      <button type="submit" className="btn-pink w-full sm:w-auto" disabled={status === "sending"}>
        {status === "sending" ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Send className="h-5 w-5" aria-hidden />}
        {status === "sending" ? a.sending : a.submit}
      </button>
    </form>
  );
}
