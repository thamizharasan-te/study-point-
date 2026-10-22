import Image, { type ImageProps } from "next/image";
import { SUPABASE_URL } from "@/lib/supabase/env";

/** True when next/image is allowed to optimise this URL (our Supabase Storage over https). */
function canOptimise(src: string): boolean {
  if (src.startsWith("/")) return !src.endsWith(".svg"); // local file; SVGs aren't optimised
  try {
    const url = new URL(src);
    return Boolean(SUPABASE_URL) && url.protocol === "https:" && url.hostname === new URL(SUPABASE_URL).hostname;
  } catch {
    return false;
  }
}

/**
 * next/image wrapper. Real photos from Supabase Storage are optimised and
 * lazy-loaded. Anything next/image can't optimise (local SVG placeholders,
 * an unexpected host) is shown as-is instead of crashing the page.
 */
export function SmartImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  // eslint-disable-next-line jsx-a11y/alt-text -- alt is always passed through props
  return <Image {...props} unoptimized={props.unoptimized || !canOptimise(src)} />;
}
