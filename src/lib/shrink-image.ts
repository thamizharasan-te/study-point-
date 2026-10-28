const MAX_SIDE = 1600; // longest side after resizing
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // bucket limit (see supabase/storage.sql)

/** Where faces usually are: when a photo is cropped, keep a bit more of the top than the bottom. */
const FOCUS_Y = 0.35;

/** Draws the picture at `maxSide` and saves it as WebP (or JPEG where the browser cannot make WebP, e.g. older Safari). */
async function render(bmp: ImageBitmap, crop: { sx: number; sy: number; sw: number; sh: number }, maxSide: number, quality: number, keepAlpha = false): Promise<{ blob: Blob; ext: string } | null> {
  const scale = Math.min(1, maxSide / Math.max(crop.sw, crop.sh));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(crop.sw * scale));
  canvas.height = Math.max(1, Math.round(crop.sh * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  if (!keepAlpha) {
    ctx.fillStyle = "#fff"; // transparent PNGs become white instead of black when saved as JPEG
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(bmp, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, canvas.width, canvas.height);
  const toBlob = (type: string) => new Promise<Blob | null>((r) => canvas.toBlob(r, type, quality));
  const webp = await toBlob("image/webp");
  if (webp && webp.type === "image/webp") return { blob: webp, ext: "webp" };
  if (keepAlpha) {
    const png = await toBlob("image/png"); // logos keep their transparent background
    return png ? { blob: png, ext: "png" } : null;
  }
  const jpeg = await toBlob("image/jpeg");
  return jpeg ? { blob: jpeg, ext: "jpg" } : null;
}

function cropFor(bmp: ImageBitmap, ratio?: number) {
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
  return { sx, sy, sw, sh };
}

/**
 * Browser-only: shrinks a photo (phone photos are often 5–10 MB) and converts it to WebP.
 * With `ratio` (width ÷ height) the photo is also cropped to exactly that shape, so every photo ends up the
 * same size and shape whatever the original was, and the website layout never changes.
 */
export async function shrinkImage(file: File, ratio?: number): Promise<{ blob: Blob; ext: string }> {
  try {
    const bmp = await createImageBitmap(file);
    const out = await render(bmp, cropFor(bmp, ratio), MAX_SIDE, 0.82);
    if (out) return out;
  } catch {
    // fall through to the original file
  }
  return { blob: file, ext: file.name.split(".").pop()?.toLowerCase() || "jpg" };
}

/**
 * Makes a picture of ANY size small enough: it tries smaller dimensions and lower quality, step by step, until
 * the file fits in `maxBytes` (optionally cropped to `ratio` first). Returns null if the file is not a picture this
 * browser can open.
 */
export async function compressToFit(file: File, maxBytes: number, ratio?: number, sides: number[] = [1800, 1500, 1200, 1000, 800, 600], keepAlpha = false): Promise<{ blob: Blob; ext: string } | null> {
  let bmp: ImageBitmap;
  try {
    bmp = await createImageBitmap(file);
  } catch {
    return null;
  }
  const crop = cropFor(bmp, ratio);
  let last: { blob: Blob; ext: string } | null = null;
  for (const side of sides) {
    for (const q of [0.82, 0.7, 0.58, 0.46]) {
      const out = await render(bmp, crop, side, q, keepAlpha);
      if (!out) return null;
      last = out;
      if (out.blob.size <= maxBytes) return out;
    }
  }
  return last && last.blob.size <= maxBytes * 2 ? last : null;
}
