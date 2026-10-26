"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Globe, Menu, X } from "lucide-react";
import clsx from "clsx";
import { localePath, stripLang } from "@/lib/i18n";
import { EnquireButton } from "./EnquireButton";
import { useLang } from "./LangProvider";
import { isDark } from "@/lib/color";
import { Logo } from "./Logo";

/**
 * Language switch: on an English page it offers "தமிழ்", on a Tamil page
 * "English", and keeps the visitor on the same page.
 */
function LanguageSwitch({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  const { lang, t } = useLang();
  const pathname = usePathname();
  const other = lang === "en" ? "ta" : "en";
  return (
    <Link
      href={localePath(other, stripLang(pathname))}
      hrefLang={other}
      lang={other}
      aria-label={t.switchTo.aria}
      className={clsx("inline-flex min-h-10 items-center gap-1.5 whitespace-nowrap rounded-full border-2 px-3 text-sm font-bold", dark ? "border-white/50 text-white hover:bg-white/15" : "border-brand-navy/20 text-brand-navy hover:bg-brand-navy-soft", className)}
    >
      <Globe className="h-4 w-4" aria-hidden /> {t.switchTo.label}
    </Link>
  );
}

export function Header({ logo, color = "#ffffff" }: { logo?: { icon?: string; full?: string }; color?: string }) {
  const dark = isDark(color);
  const { lang, t } = useLang();
  const rawPath = usePathname();
  const pathname = stripLang(rawPath); // "/ta/about" and "/about" both become "/about"
  const [menuOpen, setMenuOpen] = useState(false);
  const ta = lang === "ta"; // Tamil labels are longer, so the inline menu starts one breakpoint later

  // Close the mobile menu after navigating.
  useEffect(() => setMenuOpen(false), [rawPath]);

  return (
    <header className="sticky top-0 z-40 transform-gpu shadow-sm" style={{ backgroundColor: color }}>
      <div className="container-page flex items-center justify-between gap-2 py-2.5">
        <Logo compact chip={dark} icon={logo?.icon} full={logo?.full} href={localePath(lang, "/")} tagline={t.brand.tagline} />

        <nav aria-label={t.nav.main} className={clsx("hidden items-center", ta ? "gap-4 min-[1380px]:flex" : "gap-6 lg:flex")}>
          {t.nav.items.map((n) => {
            const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={localePath(lang, n.href)}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "whitespace-nowrap border-b-2 py-1 text-sm font-bold transition-colors",
                  dark ? (active ? "border-white text-white" : "border-transparent text-white/85 hover:text-white") : (active ? "border-brand-green text-brand-green" : "border-transparent text-brand-navy hover:text-brand-green"),
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitch dark={dark} />
          <EnquireButton className={clsx(dark ? "btn-white" : "btn-green", "hidden sm:inline-flex")}>
            {t.nav.enquire} <ArrowRight className="h-4 w-4" aria-hidden />
          </EnquireButton>
          <button
            type="button"
            className={clsx("rounded-full p-2", dark ? "text-white hover:bg-white/15" : "text-brand-navy hover:bg-brand-green-soft", ta ? "min-[1380px]:hidden" : "lg:hidden")}
            aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-7 w-7" aria-hidden /> : <Menu className="h-7 w-7" aria-hidden />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" aria-label={t.nav.mobile} className={clsx("border-t", dark ? "border-white/20" : "", ta ? "min-[1380px]:hidden" : "lg:hidden")} style={{ backgroundColor: color }}>
          <ul className="container-page py-3">
            {t.nav.items.map((n) => {
              const active = pathname === n.href;
              return (
                <li key={n.href}>
                  <Link
                    href={localePath(lang, n.href)}
                    aria-current={active ? "page" : undefined}
                    className={clsx("block rounded-xl px-3 py-3 text-base font-bold", dark ? (active ? "bg-white/20 text-white" : "text-white") : (active ? "bg-brand-green-soft text-brand-green" : "text-brand-navy"))}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-2">
              <EnquireButton className={clsx(dark ? "btn-white" : "btn-green", "w-full")} />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
