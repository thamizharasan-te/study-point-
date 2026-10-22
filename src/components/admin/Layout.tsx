import type { ReactNode } from "react";
import { CheckCircle2, TriangleAlert } from "lucide-react";

/** Page heading with a short Tamil helper line under it. */
export function AdminHeading({ title, tamil, children }: { title: string; tamil?: string; children?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-navy sm:text-3xl">{title}</h1>
        {tamil && <p className="text-sm text-gray-600">{tamil}</p>}
      </div>
      {children}
    </div>
  );
}

/** Green "Saved" / red error banner driven by ?saved= and ?error= in the URL. */
export function Notice({ saved, error }: { saved?: string; error?: string }) {
  if (error) {
    return (
      <p role="alert" className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 font-semibold text-red-700">
        <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden /> {error}
      </p>
    );
  }
  if (saved) {
    return (
      <p role="status" className="mb-4 flex items-start gap-2 rounded-xl bg-brand-green-soft p-3 font-semibold text-brand-green-dark">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden /> {saved === "1" ? "Saved." : saved}
      </p>
    );
  }
  return null;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-5 ${className}`}>{children}</section>;
}

export function Help({ children }: { children: ReactNode }) {
  return <p className="mb-4 rounded-xl bg-brand-navy-soft p-3 text-sm text-brand-navy">{children}</p>;
}

/** Checkbox that removes the "Sample" tag from the public website when ticked. */
export function ConfirmedCheckbox({ defaultChecked, label }: { defaultChecked: boolean; label: string }) {
  return (
    <label className="flex items-start gap-3 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-900">
      <input type="checkbox" name="confirmed" defaultChecked={defaultChecked} className="mt-0.5 h-5 w-5 accent-brand-green" />
      <span>{label}<span className="block font-normal">If unticked, the website shows a “Sample — to be confirmed” tag.</span></span>
    </label>
  );
}
