import Link from "next/link";
import { SmartImage } from "./SmartImage";

/** Study Point's own logo (transparent background). Admin → Main Pictures can override it. */
const BUILTIN_LOGO = "/logo.png";

/** Simple leaf mark, only used on the admin screens. */
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#e8f3e4" />
      <path d="M24 40V26" stroke="#2e7d32" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 28C14 28 11 19 12 12c8 0 12 6 12 16Z" fill="#2e7d32" />
      <path d="M24 28c10 0 13-9 12-16-8 0-12 6-12 16Z" fill="#d81b60" />
      <circle cx="24" cy="14" r="4" fill="#14306b" />
    </svg>
  );
}

/** `compact` hides the small tagline on very narrow phones (used in the header, where space is tight). */
export function Logo({ light = false, href = "/", tagline = "We make great learners", compact = false, icon, full, chip = false }: { chip?: boolean; light?: boolean; href?: string; tagline?: string; compact?: boolean; icon?: string; full?: string }) {
  // The logo to show: a full logo uploaded in admin, else the built-in one unless only an icon was uploaded.
  const logo = full ?? (icon ? undefined : BUILTIN_LOGO);
  if (logo) {
    const own = logo === BUILTIN_LOGO; // our logo is made for dark and light backgrounds; an uploaded one gets a white chip on the dark footer
    return (
      <Link href={href} className={`inline-flex items-center ${(light && !own) || chip ? "rounded-xl bg-white px-2 py-1" : ""}`} aria-label="Study Point">
        <SmartImage src={logo} alt="Study Point — we make great learners" width={own ? 900 : 480} height={own ? 634 : 160} sizes={light ? "140px" : "(min-width:640px) 120px, 100px"} priority className={`${light ? "h-24" : "h-14 sm:h-20"} w-auto max-w-[14rem] object-contain`} />
      </Link>
    );
  }
  return (
    <Link href={href} className="flex items-center gap-2">
      {icon ? <SmartImage src={icon} alt="" width={160} height={160} priority className="h-10 w-10 shrink-0 rounded-full object-contain" /> : <LogoMark />}
      <span className="leading-none">
        <span className={`block font-script text-2xl sm:text-3xl ${light ? "text-white" : "text-brand-green"}`}>
          Study <span className={light ? "text-pink-200" : "text-brand-pink"}>Point</span>
        </span>
        <span className={`${compact ? "hidden min-[430px]:block" : "block"} whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.2em] sm:text-[10px] ${light ? "text-white/80" : "text-brand-navy"}`}>
          {tagline}
        </span>
      </span>
    </Link>
  );
}
