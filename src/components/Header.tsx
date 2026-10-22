"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import clsx from "clsx";
import { Logo } from "./Logo";
import { EnquireButton } from "./EnquireButton";
import { NAV } from "@/lib/nav";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu after navigating.
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 shadow-sm backdrop-blur">
      <div className="container-page flex items-center justify-between gap-3 py-2.5">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {NAV.map((n) => {
            const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "border-b-2 py-1 text-sm font-bold transition-colors",
                  active ? "border-brand-green text-brand-green" : "border-transparent text-brand-navy hover:text-brand-green",
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <EnquireButton className="btn-green hidden sm:inline-flex">
            Enquire Now <ArrowRight className="h-4 w-4" aria-hidden />
          </EnquireButton>
          <button
            type="button"
            className="rounded-full p-2 text-brand-navy hover:bg-brand-green-soft lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-7 w-7" aria-hidden /> : <Menu className="h-7 w-7" aria-hidden />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t bg-white lg:hidden">
          <ul className="container-page py-3">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={pathname === n.href ? "page" : undefined}
                  className={clsx(
                    "block rounded-xl px-3 py-3 text-base font-bold",
                    pathname === n.href ? "bg-brand-green-soft text-brand-green" : "text-brand-navy",
                  )}
                >
                  {n.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <EnquireButton className="btn-green w-full" />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
