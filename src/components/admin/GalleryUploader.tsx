"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type DragEvent } from "react";
import { CheckCircle2, ImagePlus, Loader2, Upload, X, XCircle } from "lucide-react";
import { GALLERY_ALBUMS } from "@/lib/defaults";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { addGalleryItems } from "@/app/admin/(panel)/gallery/actions";
import { compressToFit } from "@/lib/shrink-image";

type Status = "waiting" | "uploading" | "done" | "error";
type Entry = { id: string; file: File; preview: string; status: Status; error?: string; url?: string; path?: string };

const MAX_FILES = 60; // per batch
const PARALLEL = 3; // photos prepared and uploaded at the same time

/**
 * Bulk photo upload: choose or drag many photos at once, see them, and upload them together.
 * Each photo is cropped to the gallery shape (4:3) and shrunk in the browser, then saved in one go.
 */
export function GalleryUploader() {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [album, setAlbum] = useState("Activities");
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const previews = useRef<string[]>([]);

  useEffect(() => () => previews.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const patch = (id: string, change: Partial<Entry>) => setEntries((list) => list.map((e) => (e.id === id ? { ...e, ...change } : e)));

  function addFiles(list: FileList | File[] | null) {
    if (!list) return;
    const picked = Array.from(list);
    const images = picked.filter((f) => f.type.startsWith("image/"));
    const skipped = picked.length - images.length;
    const room = MAX_FILES - entries.length;
    const take = images.slice(0, Math.max(0, room));
    const fresh = take.map((file) => {
      const preview = URL.createObjectURL(file);
      previews.current.push(preview);
      return { id: crypto.randomUUID(), file, preview, status: "waiting" as Status };
    });
    setEntries((cur) => [...cur, ...fresh]);
    const notes = [skipped ? `${skipped} file${skipped > 1 ? "s were" : " was"} not a picture and skipped.` : "", images.length > take.length ? `Only ${MAX_FILES} photos can be uploaded at a time; the rest were left out.` : ""].filter(Boolean);
    setMessage(notes.length ? { ok: false, text: notes.join(" ") } : null);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDrag(false);
    if (!busy) addFiles(e.dataTransfer.files);
  }

  async function upload() {
    const todo = entries.filter((e) => e.status === "waiting" || e.status === "error");
    if (!todo.length) return setMessage({ ok: false, text: "Please choose some photos first." });
    const albumName = album.trim() || "General";
    const folder = albumName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "general";
    setBusy(true);
    setMessage(null);
    const supabase = createBrowserSupabase();
    const uploaded: Entry[] = [];

    // 1. prepare + upload the files, a few at a time
    let next = 0;
    async function worker() {
      while (next < todo.length) {
        const entry = todo[next++];
        patch(entry.id, { status: "uploading", error: undefined });
        try {
          // Any size is fine: each photo is cropped to 4:3 and compressed until it is about 1 MB or less.
          const out = await compressToFit(entry.file, 1024 * 1024, 4 / 3, [1600, 1400, 1200, 1000, 800]);
          if (!out) throw new Error("Not a picture this browser can open");
          const { blob, ext } = out;
          const path = `${folder}/${crypto.randomUUID()}.${ext}`;
          const { error } = await supabase.storage.from("gallery").upload(path, blob, { contentType: blob.type || "image/jpeg", cacheControl: "31536000" });
          if (error) throw new Error(error.message);
          const url = supabase.storage.from("gallery").getPublicUrl(path).data.publicUrl;
          uploaded.push({ ...entry, url, path });
        } catch (err) {
          patch(entry.id, { status: "error", error: err instanceof Error ? err.message : "Upload failed" });
        }
      }
    }
    await Promise.all(Array.from({ length: Math.min(PARALLEL, todo.length) }, worker));

    // 2. save all the details in one go (in groups of 50)
    let saved = 0;
    let failedSave = false;
    for (let i = 0; i < uploaded.length; i += 50) {
      const group = uploaded.slice(i, i + 50);
      const res = await addGalleryItems({ items: group.map((g) => ({ image_url: g.url!, storage_path: g.path! })), album: albumName, alt: alt.trim() });
      if (res.ok) {
        saved += group.length;
        group.forEach((g) => patch(g.id, { status: "done" }));
      } else {
        failedSave = true;
        await supabase.storage.from("gallery").remove(group.map((g) => g.path!)); // don't leave orphan files
        group.forEach((g) => patch(g.id, { status: "error", error: res.error }));
      }
    }

    const failed = todo.length - saved;
    setBusy(false);
    setMessage(
      failed === 0
        ? { ok: true, text: `${saved} photo${saved > 1 ? "s" : ""} added to the gallery.` }
        : { ok: false, text: `${saved} added, ${failed} failed${failedSave ? "" : ""}. Press Upload again to retry the failed ones.` },
    );
    if (saved) {
      // Clear the finished photos, keep the failed ones for a retry.
      setEntries((list) => list.filter((e) => e.status !== "done"));
      router.refresh();
    }
  }

  const waiting = entries.filter((e) => e.status === "waiting" || e.status === "error").length;
  const finished = entries.filter((e) => e.status === "done" || e.status === "error").length;
  const pct = entries.length ? Math.round((finished / entries.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${drag ? "border-brand-green bg-brand-green-soft" : "border-gray-300 bg-white"}`}
      >
        <ImagePlus className="mx-auto h-9 w-9 text-brand-green" aria-hidden />
        <p className="mt-2 font-bold text-brand-navy">Drag many photos here, or</p>
        <button type="button" className="btn-outline mt-2" onClick={() => input.current?.click()} disabled={busy}>Choose photos</button>
        <input ref={input} type="file" accept="image/*" multiple className="sr-only" aria-label="Choose photos" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
        <p className="mt-2 text-xs text-gray-500">Up to {MAX_FILES} photos at a time. Each one is cropped to a 4:3 picture and made smaller automatically.</p>
      </div>

      {entries.length > 0 && (
        <>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {entries.map((e) => (
              <li key={e.id} className="relative overflow-hidden rounded-xl bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element -- local preview of a file the user just picked */}
                <img src={e.preview} alt="" className="aspect-[4/3] w-full object-cover object-[50%_35%]" />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-black/55 py-0.5 text-[11px] font-semibold text-white" title={e.error}>
                  {e.status === "uploading" && <><Loader2 className="h-3 w-3 animate-spin" aria-hidden /> Uploading</>}
                  {e.status === "done" && <><CheckCircle2 className="h-3 w-3" aria-hidden /> Done</>}
                  {e.status === "error" && <><XCircle className="h-3 w-3 text-red-300" aria-hidden /> Failed</>}
                  {e.status === "waiting" && "Ready"}
                </span>
                {!busy && (
                  <button type="button" onClick={() => setEntries((l) => l.filter((x) => x.id !== e.id))} aria-label="Remove this photo" className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80">
                    <X className="h-3.5 w-3.5" aria-hidden />
                  </button>
                )}
              </li>
            ))}
          </ul>
          {busy && (
            <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Upload progress" className="h-3 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full rounded-full bg-brand-green transition-all" style={{ width: `${pct}%` }} />
            </div>
          )}
        </>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="album">Album (for all these photos)</label>
          <input id="album" value={album} onChange={(e) => setAlbum(e.target.value)} list="albums" className="input" maxLength={40} disabled={busy} />
          <datalist id="albums">{GALLERY_ALBUMS.map((a) => <option key={a} value={a} />)}</datalist>
          <p className="mt-1 text-xs text-gray-500">Pick one or type a new album name.</p>
        </div>
        <div>
          <label className="label" htmlFor="alt">Short description (optional)</label>
          <input id="alt" value={alt} onChange={(e) => setAlt(e.target.value)} className="input" maxLength={140} placeholder="e.g. Children painting handprints" disabled={busy} />
          <p className="mt-1 text-xs text-gray-500">Helps blind visitors and Google. You can change each one later.</p>
        </div>
      </div>

      {message && (
        <p role={message.ok ? "status" : "alert"} className={`rounded-lg p-3 text-sm font-semibold ${message.ok ? "bg-brand-green-soft text-brand-green-dark" : "bg-red-50 text-red-700"}`}>{message.text}</p>
      )}

      <button type="button" onClick={upload} className="btn-green" disabled={busy || waiting === 0}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Upload className="h-4 w-4" aria-hidden />}
        {busy ? `Uploading… ${finished} / ${entries.length}` : waiting ? `Upload ${waiting} photo${waiting > 1 ? "s" : ""}` : "Upload photos"}
      </button>
    </div>
  );
}
