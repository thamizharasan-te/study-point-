"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Loader2, Upload } from "lucide-react";
import { GALLERY_ALBUMS } from "@/lib/defaults";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { addGalleryItem } from "@/app/admin/(panel)/gallery/actions";

import { MAX_UPLOAD_BYTES, shrinkImage } from "@/lib/shrink-image";

export function GalleryUploader() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const files = (fd.getAll("photos") as File[]).filter((f) => f.size > 0);
    const album = String(fd.get("album") || "General").trim() || "General";
    const alt = String(fd.get("alt") || "").trim();
    if (!files.length) return setMessage({ ok: false, text: "Please choose at least one photo." });

    setBusy(true);
    setMessage(null);
    const supabase = createBrowserSupabase();
    let done = 0;
    try {
      for (const file of files) {
        if (!file.type.startsWith("image/")) throw new Error(`“${file.name}” is not a picture.`);
        const { blob, ext } = await shrinkImage(file);
        if (blob.size > MAX_UPLOAD_BYTES) throw new Error(`“${file.name}” is too large (max 5 MB).`);
        const path = `${album.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "general"}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("gallery").upload(path, blob, { contentType: blob.type || "image/jpeg", cacheControl: "31536000" });
        if (error) throw new Error(error.message);
        const url = supabase.storage.from("gallery").getPublicUrl(path).data.publicUrl;
        const res = await addGalleryItem({ image_url: url, storage_path: path, album, alt: alt || `${album} photo at Study Point` });
        if (!res.ok) {
          await supabase.storage.from("gallery").remove([path]); // don't leave an orphan file
          throw new Error(res.error);
        }
        done++;
      }
      form.reset();
      setMessage({ ok: true, text: `${done} photo${done > 1 ? "s" : ""} added.` });
    } catch (err) {
      setMessage({ ok: false, text: (err instanceof Error ? err.message : "Upload failed.") + (done ? ` (${done} uploaded before the problem.)` : "") });
    } finally {
      setBusy(false);
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label" htmlFor="photos">Choose photos</label>
        <input id="photos" name="photos" type="file" accept="image/*" multiple className="input !p-2" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="album">Album</label>
          <input id="album" name="album" list="albums" defaultValue="Activities" className="input" maxLength={40} />
          <datalist id="albums">{GALLERY_ALBUMS.map((a) => <option key={a} value={a} />)}</datalist>
          <p className="mt-1 text-xs text-gray-500">Pick one or type a new album name.</p>
        </div>
        <div>
          <label className="label" htmlFor="alt">Short description</label>
          <input id="alt" name="alt" className="input" maxLength={140} placeholder="e.g. Children painting handprints" />
          <p className="mt-1 text-xs text-gray-500">Helps blind visitors and Google. You can change it later.</p>
        </div>
      </div>
      {message && (
        <p role={message.ok ? "status" : "alert"} className={`rounded-lg p-3 text-sm font-semibold ${message.ok ? "bg-brand-green-soft text-brand-green-dark" : "bg-red-50 text-red-700"}`}>{message.text}</p>
      )}
      <button type="submit" className="btn-green" disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Upload className="h-4 w-4" aria-hidden />}
        {busy ? "Uploading…" : "Upload photos"}
      </button>
    </form>
  );
}
