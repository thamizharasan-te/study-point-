"use client";

import { useRef, useState, type FormEvent } from "react";
import { FileCheck2, Loader2, Send, Upload } from "lucide-react";
import { MAX_FILE_BYTES, MAX_TOTAL_BYTES } from "@/lib/application";
import { fmt } from "@/lib/i18n";
import { compressToFit } from "@/lib/shrink-image";
import { useLang } from "./LangProvider";

type Status = "idle" | "sending" | "done" | "error";

/** Shows a trailing "*" (required field) in red. */
const req = (text: string): React.ReactNode => {
  const m = /^(.*?)\s*\*$/.exec(text);
  return m ? <>{m[1]} <span className="font-bold text-red-600" aria-hidden="true">*</span><span className="sr-only"> (required)</span></> : text;
};

const Field = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => (
  <div>
    <label className="label" htmlFor={id}>{req(label)}</label>
    {children}
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <fieldset className="space-y-4 rounded-2xl border border-gray-200 p-4 sm:p-5">
    <legend className="px-2 text-lg font-extrabold text-brand-navy">{title}</legend>
    {children}
  </fieldset>
);

/** Date of birth as three drop-downs (day, month, year): much easier than a calendar when the year is far back. */
function DateOfBirth({ label, day, month, year, months }: { label: React.ReactNode; day: string; month: string; year: string; months: string[] }) {
  const [d, setD] = useState("");
  const [m, setM] = useState("");
  const [y, setY] = useState("");
  const now = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => String(now - i)); // children up to 20 years old, newest first
  const daysIn = m && y ? new Date(Number(y), Number(m), 0).getDate() : 31;
  const value = d && m && y ? `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}` : "";
  const sel = "input !px-3";
  return (
    <div>
      <span className="label" id="dob-label">{label}</span>
      <input type="hidden" name="child_dob" value={value} />
      <div role="group" aria-labelledby="dob-label" className="grid grid-cols-[1fr_1.6fr_1.2fr] gap-2">
        <select aria-label={day} className={sel} required value={d} onChange={(e) => setD(e.target.value)}>
          <option value="" disabled>{day}</option>
          {Array.from({ length: daysIn }, (_, i) => String(i + 1)).map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <select aria-label={month} className={sel} required value={m} onChange={(e) => { setM(e.target.value); if (Number(d) > new Date(Number(y || 2000), Number(e.target.value), 0).getDate()) setD(""); }}>
          <option value="" disabled>{month}</option>
          {months.map((name, i) => <option key={name} value={String(i + 1)}>{name}</option>)}
        </select>
        <select aria-label={year} className={sel} required value={y} onChange={(e) => { setY(e.target.value); if (m && Number(d) > new Date(Number(e.target.value), Number(m), 0).getDate()) setD(""); }}>
          <option value="" disabled>{year}</option>
          {years.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
    </div>
  );
}

/** A file picker that shows the chosen file's name. */
function FilePick({ name, label, accept, required, hint }: { name: string; label: string; accept: string; required?: boolean; hint?: string }) {
  const [picked, setPicked] = useState("");
  return (
    <div>
      <span className="label">{req(label)}</span>
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
      for (const key of ["photo", "birth_cert", "other_doc"]) {
        const f = fd.get(key);
        if (!(f instanceof File) || f.size === 0) { fd.delete(key); continue; }
        if (f.type === "application/pdf") {
          if (f.size > MAX_FILE_BYTES) throw new Error(a.errors.pdfTooBig);
          total += f.size;
        } else {
          const out = await compressToFit(f, 700 * 1024);
          if (!out) throw new Error(a.errors.notPicture);
          fd.set(key, out.blob, `${key}.${out.ext}`);
          total += out.blob.size;
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
          <DateOfBirth label={req(a.labels.dob)} day={a.labels.day} month={a.labels.month} year={a.labels.year} months={a.months} />
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
          <FilePick name="photo" label={a.labels.photo} accept="image/*" required hint={a.labels.choose} />
          <FilePick name="birth_cert" label={a.labels.birthCert} accept="image/*,application/pdf" required hint={a.labels.choose} />
          <FilePick name="other_doc" label={a.labels.otherDoc} accept="image/*,application/pdf" hint={a.labels.choose} />
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
          <span>{req(a.consent)}</span>
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
