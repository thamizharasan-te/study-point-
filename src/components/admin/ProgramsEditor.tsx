"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { Program } from "@/lib/types";

/**
 * Editable list of programmes (title + description). The current list is sent
 * to the server as JSON in a hidden field, so no technical knowledge is needed.
 */
/** `idPrefix` keeps field ids unique when two editors are on the same page. */
export function ProgramsEditor({ name, idPrefix, initial, titleLabel = "Title", descLabel = "Description", maxDesc = 200 }: { name: string; idPrefix: string; initial: Program[]; titleLabel?: string; descLabel?: string; maxDesc?: number }) {
  const [items, setItems] = useState<Program[]>(initial);

  const update = (i: number, patch: Partial<Program>) => setItems((l) => l.map((p, k) => (k === i ? { ...p, ...patch } : p)));
  const move = (i: number, d: number) =>
    setItems((l) => {
      const j = i + d;
      if (j < 0 || j >= l.length) return l;
      const c = [...l];
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(items)} />
      {items.map((p, i) => (
        <div key={i} className="rounded-xl border border-gray-200 p-3">
          <label className="label" htmlFor={`${idPrefix}-t-${i}`}>{titleLabel}</label>
          <input id={`${idPrefix}-t-${i}`} className="input" value={p.title} maxLength={maxDesc === 200 ? 40 : 120} onChange={(e) => update(i, { title: e.target.value })} />
          <label className="label mt-2" htmlFor={`${idPrefix}-d-${i}`}>{descLabel}</label>
          <textarea id={`${idPrefix}-d-${i}`} className="input" rows={maxDesc === 200 ? 2 : 3} value={p.description} maxLength={maxDesc} onChange={(e) => update(i, { description: e.target.value })} />
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${p.title || "item"} up`} className="btn border border-gray-300 !min-h-9 !px-3 !py-1 disabled:opacity-40"><ArrowUp className="h-4 w-4" aria-hidden /></button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`Move ${p.title || "item"} down`} className="btn border border-gray-300 !min-h-9 !px-3 !py-1 disabled:opacity-40"><ArrowDown className="h-4 w-4" aria-hidden /></button>
            <button type="button" onClick={() => setItems((l) => l.filter((_, k) => k !== i))} className="btn ml-auto !min-h-9 !px-3 !py-1 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" aria-hidden /> Remove</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => setItems((l) => [...l, { title: "", description: "" }])} className="btn-outline">
        <Plus className="h-4 w-4" aria-hidden /> Add another
      </button>
    </div>
  );
}
