"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { MAX_UPLOAD_BYTES, shrinkImage } from "@/lib/shrink-image";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { setSiteImage } from "@/app/admin/(panel)/images/actions";

/** Choose a photo → it is shrunk in the browser, uploaded, and replaces the picture on the website. */
export function ImageSlotUploader({ slot }: { slot: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function onPick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setMessage(null);
    try {
      if (!file.type.startsWith("image/")) throw new Error("Please choose a picture file.");
      const { blob, ext } = await shrinkImage(file);
      if (blob.size > MAX_UPLOAD_BYTES) throw new Error("That picture is too large (max 5 MB).");
      const supabase = createBrowserSupabase();
      const path = `site/${slot}-${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("gallery").upload(path, blob, { contentType: blob.type || "image/jpeg", cacheControl: "31536000" });
      if (error) throw new Error(error.message);
      const url = supabase.storage.from("gallery").getPublicUrl(path).data.publicUrl;
      const res = await setSiteImage({ slot, url });
      if (!res.ok) {
        await supabase.storage.from("gallery").remove([path]);
        throw new Error(res.error);
      }
      setMessage({ ok: true, text: "Picture updated. It is now live on the website." });
      router.refresh();
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "Upload failed." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="btn-green cursor-pointer">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Upload className="h-4 w-4" aria-hidden />}
        {busy ? "Uploading…" : "Choose a new picture"}
        <input type="file" accept="image/*" className="sr-only" disabled={busy} onChange={(e) => { void onPick(e.target.files?.[0]); e.target.value = ""; }} />
      </label>
      {message && (
        <p role={message.ok ? "status" : "alert"} className={`rounded-lg p-2 text-sm font-semibold ${message.ok ? "bg-brand-green-soft text-brand-green-dark" : "bg-red-50 text-red-700"}`}>{message.text}</p>
      )}
    </div>
  );
}
