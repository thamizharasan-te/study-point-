"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { localePath, stripLang } from "@/lib/i18n";
import { useLang } from "./LangProvider";

/** "Home › Page" trail shown at the top of inner pages. */
export function Crumbs() {
  const { lang, t } = useLang();
  const path = stripLang(usePathname());
  const here = t.nav.items.find((i) => i.href !== "/" && path.startsWith(i.href));
  if (!here) return null;
  return (
    <nav aria-label={t.cta.crumbs} className="mb-3 flex items-center justify-center gap-1 text-sm font-semibold text-gray-600">
      <Link href={localePath(lang, "/")} className="rounded px-1 py-1 hover:text-brand-navy hover:underline">{t.nav.items[0].label}</Link>
      <ChevronRight className="h-4 w-4" aria-hidden />
      <span aria-current="page" className="px-1 text-brand-navy">{here.label}</span>
    </nav>
  );
}
