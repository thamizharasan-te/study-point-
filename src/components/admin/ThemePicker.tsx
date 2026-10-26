"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { isDark } from "@/lib/color";
import { DEFAULT_THEME_ID, THEMES, getTheme } from "@/lib/themes";

/** Choose a website theme from ready-made colour sets, each shown as a small preview of the website. */
export function ThemePicker({ initial }: { initial: string }) {
  const [id, setId] = useState(getTheme(initial).id);
  return (
    <div>
      <input type="hidden" name="theme" value={id} />
      <div role="radiogroup" aria-label="Website theme" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {THEMES.map((t) => {
          const active = t.id === id;
          const dark = isDark(t.header);
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setId(t.id)}
              className={`overflow-hidden rounded-2xl border-2 bg-white text-left transition-shadow ${active ? "border-brand-green shadow-card ring-2 ring-brand-green/30" : "border-gray-200 hover:shadow-md"}`}
            >
              {/* mini website: header, headline, buttons, footer */}
              <span className="block" style={{ backgroundColor: t.cream }} aria-hidden>
                <span className="flex items-center justify-between px-3 py-1.5" style={{ backgroundColor: t.header }}>
                  <span className="h-2 w-10 rounded" style={{ backgroundColor: dark ? "#fff" : t.navy }} />
                  <span className="h-2 w-6 rounded-full" style={{ backgroundColor: dark ? "#fff" : t.primary }} />
                </span>
                <span className="block px-3 pb-2 pt-3">
                  <span className="block h-2.5 w-24 rounded" style={{ backgroundColor: t.navy }} />
                  <span className="mt-1.5 block h-2.5 w-16 rounded" style={{ backgroundColor: t.primary }} />
                  <span className="mt-2 flex gap-1.5">
                    <span className="h-3.5 w-12 rounded-full" style={{ backgroundColor: t.primary }} />
                    <span className="h-3.5 w-12 rounded-full" style={{ backgroundColor: t.accent }} />
                  </span>
                </span>
                <span className="block h-4" style={{ backgroundColor: t.navy }} />
              </span>
              <span className="flex items-start gap-2 p-3">
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-brand-navy">{t.label}{t.id === DEFAULT_THEME_ID && <span className="ml-1 text-xs font-semibold text-gray-500">(original)</span>}</span>
                  <span className="block text-xs text-gray-600">{t.description}</span>
                </span>
                {active && <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green text-white"><Check className="h-4 w-4" aria-hidden /></span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
