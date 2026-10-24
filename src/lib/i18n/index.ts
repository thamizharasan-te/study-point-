import { en, type Dict } from "./en";
import { ta } from "./ta";

export type Lang = "en" | "ta";
export const LANGS: Lang[] = ["en", "ta"];
export const DEFAULT_LANG: Lang = "en";

export const isLang = (v: string): v is Lang => v === "en" || v === "ta";
export const getDict = (lang: Lang): Dict => (lang === "ta" ? ta : en);
export type { Dict };

/**
 * Public address of a page in a language. English has no prefix
 * (/about), Tamil lives under /ta (/ta/about).
 */
export function localePath(lang: Lang, path: string): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  if (lang === "en") return clean || "/";
  return `/ta${clean}`;
}

/** Removes a leading /en or /ta from a path, e.g. "/ta/about" → "/about". */
export function stripLang(pathname: string): string {
  const m = /^\/(en|ta)(\/.*)?$/.exec(pathname);
  return m ? m[2] || "/" : pathname;
}

/** Replaces {placeholders} in a dictionary string. */
export function fmt(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
