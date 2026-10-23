const MAX_SIDE = 1600; // longest side after resizing
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // bucket limit (see supabase/storage.sql)

/** Browser-only: shrinks a photo (phone photos are often 5–10 MB) and converts it to WebP. */
export async function shrinkImage(file: File): Promise<{ blob: Blob; ext: string }> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.82));
    if (blob) return { blob, ext: "webp" };
  } catch {
    // fall through to the original file
  }
  return { blob: file, ext: file.name.split(".").pop()?.toLowerCase() || "jpg" };
}
