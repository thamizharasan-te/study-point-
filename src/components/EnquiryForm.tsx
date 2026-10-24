"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";
import { INTERESTS } from "@/lib/validation";
import { useLang } from "./LangProvider";

type Status = "idle" | "sending" | "done" | "error";

/** Enquiry form shared by the pop-up and the Contact page. Option values stay English; labels follow the language. */
export function EnquiryForm({
  branches,
  defaultInterest,
  onDone,
}: {
  branches: { value: string; label: string }[];
  defaultInterest?: string;
  onDone?: () => void;
}) {
  const { lang, t } = useLang();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError("");
    const data = { ...Object.fromEntries(new FormData(form).entries()), lang };
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || t.form.errors.generic);
      form.reset();
      setStatus("done");
      onDone?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.form.errors.generic);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="rounded-2xl bg-brand-green-soft p-6 text-center">
        <p className="font-display text-2xl font-bold text-brand-green-dark">{t.form.thanks}</p>
        <p className="mt-2 text-brand-ink">{t.form.received}</p>
        <button type="button" className="btn-outline mt-4" onClick={() => setStatus("idle")}>
          {t.form.another}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate={false}>
      {/* Honeypot: hidden from people, tempting to bots. Must stay empty. */}
      <div className="sr-only-field" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="parent_name">{t.form.parent}</label>
          <input className="input" id="parent_name" name="parent_name" required minLength={2} maxLength={100} autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="phone">{t.form.phone}</label>
          <input className="input" id="phone" name="phone" type="tel" inputMode="tel" required maxLength={30} autoComplete="tel" placeholder="07X XXX XXXX" />
        </div>
        <div>
          <label className="label" htmlFor="child_name">{t.form.child}</label>
          <input className="input" id="child_name" name="child_name" maxLength={100} />
        </div>
        <div>
          <label className="label" htmlFor="child_age">{t.form.age}</label>
          <input className="input" id="child_age" name="child_age" maxLength={30} placeholder={t.form.agePlaceholder} />
        </div>
        <div>
          <label className="label" htmlFor="interest">{t.form.interest}</label>
          <select className="input" id="interest" name="interest" defaultValue={defaultInterest ?? INTERESTS[2]}>
            {INTERESTS.map((value, i) => <option key={value} value={value}>{t.form.interests[i]}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="branch">{t.form.branch}</label>
          <select className="input" id="branch" name="branch" defaultValue="">
            <option value="">{t.form.anyBranch}</option>
            {branches.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="message">{t.form.message}</label>
        <textarea className="input" id="message" name="message" rows={3} maxLength={1000} />
      </div>

      {status === "error" && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

      <button type="submit" className="btn-pink w-full sm:w-auto" disabled={status === "sending"}>
        {status === "sending" ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Send className="h-5 w-5" aria-hidden />}
        {status === "sending" ? t.form.sending : t.form.send}
      </button>
    </form>
  );
}
