import { IMAGE_SLOTS } from "./defaults";
import type { ImageSlot, SiteImages } from "./types";

/** Picture for a slot: the photo uploaded in admin, or the built-in illustration. */
export function slotImage(images: SiteImages, slot: ImageSlot) {
  const meta = IMAGE_SLOTS[slot];
  return { src: images[slot] || meta.fallback, alt: meta.alt, width: meta.width, height: meta.height };
}
