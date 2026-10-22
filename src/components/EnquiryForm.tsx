"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";
import { INTERESTS } from "@/lib/validation";

type Status = "idle" | "sending" | "done" | "error";

/** Enquiry form shared by the pop-up and the Contact page. */
export function EnquiryForm({
  branches,
  defaultInterest,
  onDone,
}: {
  branches: string[];
  defaultInterest?: string;
  onDone?: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError("");
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      form.reset();
      setStatus("done");
      onDone?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="rounded-2xl bg-brand-green-soft p-6 text-center">
        <p className="font-display text-2xl font-bold text-brand-green-dark">Thank you!</p>
        <p className="mt-2 text-brand-ink">We have received your enquiry and will contact you very soon.</p>
        <button type="button" className="btn-outline mt-4" onClick={() => setStatus("idle")}>
          Send another enquiry
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
          <label className="label" htmlFor="parent_name">Parent / guardian name *</label>
          <input className="input" id="parent_name" name="parent_name" required minLength={2} maxLength={100} autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone / WhatsApp number *</label>
          <input className="input" id="phone" name="phone" type="tel" inputMode="tel" required maxLength={30} autoComplete="tel" placeholder="07X XXX XXXX" />
        </div>
        <div>
          <label className="label" htmlFor="child_name">Child&apos;s name</label>
          <input className="input" id="child_name" name="child_name" maxLength={100} />
        </div>
        <div>
          <label className="label" htmlFor="child_age">Child&apos;s age</label>
          <input className="input" id="child_age" name="child_age" maxLength={30} placeholder="e.g. 4 years" />
        </div>
        <div>
          <label className="label" htmlFor="interest">Interested in</label>
          <select className="input" id="interest" name="interest" defaultValue={defaultInterest ?? INTERESTS[2]}>
            {INTERESTS.map((i) => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="branch">Preferred branch</label>
          <select className="input" id="branch" name="branch" defaultValue="">
            <option value="">Either branch</option>
            {branches.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="message">Message (optional)</label>
        <textarea className="input" id="message" name="message" rows={3} maxLength={1000} />
      </div>

      {status === "error" && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

      <button type="submit" className="btn-pink w-full sm:w-auto" disabled={status === "sending"}>
        {status === "sending" ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Send className="h-5 w-5" aria-hidden />}
        {status === "sending" ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}
