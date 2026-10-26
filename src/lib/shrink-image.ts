const MAX_SIDE = 1600; // longest side after resizing
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // bucket limit (see supabase/storage.sql)

/** Where faces usually are: when a photo is cropped, keep a bit more of the top than the bottom. */
const FOCUS_Y = 0.35;

/**
 * Browser-only: shrinks a photo (phone photos are often 5–10 MB) and converts it to WebP.
 * With `ratio` (width ÷ height) the photo is also cropped to exactly that shape, so every photo ends up the
 * same size and shape whatever the original was, and the website layout never changes with the photo.
 */
export async function shrinkImage(file: File, ratio?: number): Promise<{ blob: Blob; ext: string }> {
  try {
    const bmp = await createImageBitmap(file);
    let sx = 0, sy = 0, sw = bmp.width, sh = bmp.height;
    if (ratio) {
      if (bmp.width / bmp.height > ratio) {
        sw = Math.round(bmp.height * ratio); // too wide: trim the sides equally
        sx = Math.round((bmp.width - sw) / 2);
      } else {
        sh = Math.round(bmp.width / ratio); // too tall: trim more from the bottom than the top
        sy = Math.round((bmp.height - sh) * FOCUS_Y);
      }
    }
    const scale = Math.min(1, MAX_SIDE / Math.max(sw, sh));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(sw * scale);
    canvas.height = Math.round(sh * scale);
    canvas.getContext("2d")!.drawImage(bmp, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.82));
    if (blob) return { blob, ext: "webp" };
  } catch {
    // fall through to the original file
  }
  return { blob: file, ext: file.name.split(".").pop()?.toLowerCase() || "jpg" };
}
