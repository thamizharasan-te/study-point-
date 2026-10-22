import Image, { type ImageProps } from "next/image";

/**
 * next/image wrapper. Local SVG placeholders can't go through the optimiser,
 * so they're served as-is; every real photo (Supabase Storage) is optimised
 * and lazy-loaded automatically.
 */
export function SmartImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  const isSvg = src.endsWith(".svg");
  // eslint-disable-next-line jsx-a11y/alt-text -- alt is always passed through props
  return <Image {...props} unoptimized={isSvg || props.unoptimized} />;
}
