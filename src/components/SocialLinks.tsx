import { fmt, getDict, type Lang } from "@/lib/i18n";
import type { Social } from "@/lib/types";

import { BrandIcon } from "./BrandIcons";

export const ICONS = { facebook: 1, instagram: 1, tiktok: 1, youtube: 1 } as const;

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
            <BrandIcon name={k} className="h-5 w-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
