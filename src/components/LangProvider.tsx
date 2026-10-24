"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dict, Lang } from "@/lib/i18n";

const Ctx = createContext<{ lang: Lang; t: Dict } | null>(null);

/** Gives client components the current language and its text. */
export function LangProvider({ lang, dict, children }: { lang: Lang; dict: Dict; children: ReactNode }) {
  return <Ctx.Provider value={{ lang, t: dict }}>{children}</Ctx.Provider>;
}

export function useLang() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLang must be used inside <LangProvider>");
  return v;
}
