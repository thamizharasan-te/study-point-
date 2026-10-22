import Link from "next/link";

/**
 * Temporary logo: a simple leaf-and-children mark plus the wordmark.
 * Replace with the real logo file (e.g. public/logo.svg) when the client supplies it.
 */
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

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <LogoMark />
      <span className="leading-none">
        <span className={`block font-script text-2xl sm:text-3xl ${light ? "text-white" : "text-brand-green"}`}>
          Study <span className={light ? "text-pink-200" : "text-brand-pink"}>Point</span>
        </span>
        <span className={`block text-[9px] font-bold uppercase tracking-[0.2em] sm:text-[10px] ${light ? "text-white/80" : "text-brand-navy"}`}>
          We make great learners
        </span>
      </span>
    </Link>
  );
}
