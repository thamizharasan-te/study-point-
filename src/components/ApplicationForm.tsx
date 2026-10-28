"use client";

import { useRef, useState, type FormEvent } from "react";
import { FileCheck2, Loader2, Send, Upload } from "lucide-react";
import { MAX_FILE_BYTES, MAX_TOTAL_BYTES } from "@/lib/application";
import { fmt } from "@/lib/i18n";
import { shrinkImage } from "@/lib/shrink-image";
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
  const a = t.apply;
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
      // Shrink pictures here so the upload is small and quick (PDFs are sent as they are).
      let total = 0;
      for (const key of ["photo", "birth_cert", "other_doc"]) {
        const f = fd.get(key);
        if (!(f instanceof File) || f.size === 0) { fd.delete(key); continue; }
        if (f.type.startsWith("image/")) {
          const { blob, ext } = await shrinkImage(f);
          fd.set(key, blob, `${key}.${ext}`);
          total += blob.size;
          if (blob.size > MAX_FILE_BYTES) throw new Error(a.errors.tooBig);
        } else {
          total += f.size;
          if (f.size > MAX_FILE_BYTES) throw new Error(a.errors.tooBig);
        }
      }
      if (total > MAX_TOTAL_BYTES) throw new Error(a.errors.tooBig);
      const res = await fetch("/api/application", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || a.errors.generic);
      setChild(String(fd.get("child_name") ?? ""));
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

  return (
    <form ref={formRef} onSubmit={submit} className="space-y-5" encType="multipart/form-data">
      {/* Honeypot: hidden from people, tempting to bots. Must stay empty. */}
      <div className="sr-only-field" aria-hidden="true">
        <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <Section title={a.sections.child}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="child_name" label={a.labels.childName}><input className="input" id="child_name" name="child_name" required minLength={2} maxLength={100} autoComplete="off" /></Field>
          <Field id="child_dob" label={a.labels.dob}><input className="input" id="child_dob" name="child_dob" type="date" required max={today} /></Field>
          <Field id="child_gender" label={a.labels.gender}>
            <select className="input" id="child_gender" name="child_gender" defaultValue="">
              <option value="">{a.labels.choose}</option>
              {["Boy", "Girl", "Prefer not to say"].map((v, i) => <option key={v} value={v}>{a.genders[i]}</option>)}
            </select>
          </Field>
          <Field id="previous_school" label={a.labels.previousSchool}><input className="input" id="previous_school" name="previous_school" maxLength={120} /></Field>
        </div>
        <Field id="health_notes" label={a.labels.health}><textarea className="input" id="health_notes" name="health_notes" rows={2} maxLength={1000} /></Field>
      </Section>

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

      <Section title={a.sections.parent}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="parent_name" label={a.labels.parentName}><input className="input" id="parent_name" name="parent_name" required minLength={2} maxLength={100} autoComplete="name" /></Field>
          <Field id="relationship" label={a.labels.relationship}>
            <select className="input" id="relationship" name="relationship" defaultValue="">
              <option value="">{a.labels.choose}</option>
              {["Mother", "Father", "Guardian", "Other"].map((v, i) => <option key={v} value={v}>{a.relationships[i]}</option>)}
            </select>
          </Field>
          <Field id="phone" label={a.labels.phone}><input className="input" id="phone" name="phone" type="tel" inputMode="tel" required maxLength={30} autoComplete="tel" placeholder="07X XXX XXXX" /></Field>
          <Field id="whatsapp" label={a.labels.whatsapp}><input className="input" id="whatsapp" name="whatsapp" type="tel" inputMode="tel" maxLength={30} placeholder="07X XXX XXXX" /></Field>
          <Field id="email" label={a.labels.email}><input className="input" id="email" name="email" type="email" maxLength={120} autoComplete="email" /></Field>
        </div>
        <Field id="address" label={a.labels.address}><textarea className="input" id="address" name="address" rows={2} maxLength={300} autoComplete="street-address" /></Field>
      </Section>

      <Section title={a.sections.emergency}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="emergency_name" label={a.labels.emergencyName}><input className="input" id="emergency_name" name="emergency_name" maxLength={100} /></Field>
          <Field id="emergency_phone" label={a.labels.emergencyPhone}><input className="input" id="emergency_phone" name="emergency_phone" type="tel" inputMode="tel" maxLength={30} /></Field>
        </div>
      </Section>

      <Section title={a.sections.documents}>
        <p className="text-sm text-gray-600">{a.fileHelp}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <FilePick name="photo" label={a.labels.photo} accept="image/jpeg,image/png,image/webp" required hint={a.labels.choose} />
          <FilePick name="birth_cert" label={a.labels.birthCert} accept="image/jpeg,image/png,image/webp,application/pdf" required hint={a.labels.choose} />
          <FilePick name="other_doc" label={a.labels.otherDoc} accept="image/jpeg,image/png,image/webp,application/pdf" hint={a.labels.choose} />
        </div>
      </Section>

      <Section title={a.sections.more}>
        <Field id="how_heard" label={a.labels.howHeard}>
          <select className="input" id="how_heard" name="how_heard" defaultValue="">
            <option value="">{a.labels.choose}</option>
            {["Facebook", "Instagram", "TikTok", "Friend or family", "Passing by", "Other"].map((v, i) => <option key={v} value={v}>{a.heardOptions[i]}</option>)}
          </select>
        </Field>
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
