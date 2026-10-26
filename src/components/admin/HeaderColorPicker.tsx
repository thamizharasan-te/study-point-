"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { DEFAULT_HEADER_COLOR, HEADER_COLORS, isDark, isHex } from "@/lib/color";

/** Pick the website header colour from ready-made colours or any colour, with a live preview. */
export function HeaderColorPicker({ initial }: { initial: string }) {
  const [color, setColor] = useState(isHex(initial) ? initial.toLowerCase() : DEFAULT_HEADER_COLOR);
  const dark = isDark(color);
  const text = dark ? "text-white" : "text-brand-navy";
  return (
    <div className="space-y-4">
      <input type="hidden" name="color" value={color} />
      <div role="radiogroup" aria-label="Header colour" className="flex flex-wrap gap-3">
        {HEADER_COLORS.map((c) => {
          const active = c.value === color;
          return (
            <button
              key={c.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setColor(c.value)}
              className={`flex w-24 flex-col items-center gap-1.5 rounded-xl p-2 text-center text-xs font-semibold text-brand-navy ${active ? "bg-brand-green-soft ring-2 ring-brand-green" : "hover:bg-gray-100"}`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300" style={{ backgroundColor: c.value }}>
                {active && <Check className={`h-5 w-5 ${isDark(c.value) ? "text-white" : "text-brand-green"}`} aria-hidden />}
              </span>
              {c.label}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="label !mb-0" htmlFor="custom-color">Or choose any colour:</label>
        <input id="custom-color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-16 cursor-pointer rounded border border-gray-300 bg-white p-1" />
        <span className="text-sm font-mono text-gray-600">{color}</span>
      </div>
      <div>
        <p className="label">Preview</p>
        <div className={`flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold ${text}`} style={{ backgroundColor: color }}>
          <span className="font-script text-xl">Study Point</span>
          <span className="hidden gap-4 sm:flex"><span>Home</span><span>About Us</span><span>Early Years</span><span>Contact</span></span>
          <span className={`rounded-full px-4 py-1.5 ${dark ? "bg-white text-brand-green-dark" : "bg-brand-green text-white"}`}>Enquire Now</span>
        </div>
      </div>
    </div>
  );
}
