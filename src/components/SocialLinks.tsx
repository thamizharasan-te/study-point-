import { fmt, getDict, type Lang } from "@/lib/i18n";
import type { Social } from "@/lib/types";

// Simple inline icons (lucide no longer ships brand logos).
export const ICONS = {
  facebook: <path d="M14 8h2V5h-2.5C11 5 10 6.6 10 8.7V11H8v3h2v6h3v-6h2.2l.4-3H13V9c0-.6.3-1 1-1Z" />,
  instagram: <><rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17" cy="7" r="1.1" /></>,
  tiktok: <path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6Z" />,
  youtube: <path d="M21 8.2a2.6 2.6 0 0 0-1.8-1.8C17.6 6 12 6 12 6s-5.6 0-7.2.4A2.6 2.6 0 0 0 3 8.2C2.6 9.8 2.6 12 2.6 12s0 2.2.4 3.8a2.6 2.6 0 0 0 1.8 1.8c1.6.4 7.2.4 7.2.4s5.6 0 7.2-.4a2.6 2.6 0 0 0 1.8-1.8c.4-1.6.4-3.8.4-3.8s0-2.2-.4-3.8ZM10.3 14.8V9.2L15 12l-4.7 2.8Z" />,
} as const;

export const BRAND = { facebook: "bg-[#1877f2] hover:brightness-110", instagram: "bg-gradient-to-tr from-[#f9a03f] via-[#e1306c] to-[#833ab4] hover:brightness-110", youtube: "bg-[#c4302b] hover:brightness-110", tiktok: "bg-black hover:bg-neutral-800" } as const;
const TONES = {
  light: { facebook: "bg-white/10 hover:bg-white/25", instagram: "bg-white/10 hover:bg-white/25", youtube: "bg-white/10 hover:bg-white/25", tiktok: "bg-white/10 hover:bg-white/25" },
  dark: { facebook: "bg-brand-navy hover:bg-brand-navy-dark", instagram: "bg-brand-navy hover:bg-brand-navy-dark", youtube: "bg-brand-navy hover:bg-brand-navy-dark", tiktok: "bg-brand-navy hover:bg-brand-navy-dark" },
  color: BRAND,
} as const;

/** Round social icons; only the links the admin has filled in are shown. */
export const SOCIAL_NAMES = { facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube" } as const;

export function SocialLinks({ social, tone = "light", lang = "en" }: { social: Social; tone?: "light" | "dark" | "color"; lang?: Lang }) {
  const on = getDict(lang).updates.on;
  const shown = (Object.keys(ICONS) as (keyof typeof ICONS)[]).filter((k) => social[k]);
  if (!shown.length) return null;
  return (
    <ul className="flex gap-3">
      {shown.map((k) => (
        <li key={k}>
          <a href={social[k]} target="_blank" rel="noopener noreferrer" aria-label={fmt(on, { name: SOCIAL_NAMES[k] })} className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${TONES[tone][k]}`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">{ICONS[k]}</svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
