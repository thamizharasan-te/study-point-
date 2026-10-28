"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { setApplicationPdf } from "@/app/admin/(panel)/applications/actions";

/** Choose the printable application form (PDF) → it is saved and a download button appears on the Apply page. */
export function ApplicationPdfUploader({ hasFile }: { hasFile: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function onPick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setMessage(null);
    try {
      if (file.type !== "application/pdf") throw new Error("Please choose a PDF file.");
      if (file.size > 5 * 1024 * 1024) throw new Error("That PDF is too large (max 5 MB).");
      const supabase = createBrowserSupabase();
      const path = "application-form.pdf";
      const { error } = await supabase.storage.from("forms").upload(path, file, { contentType: "application/pdf", upsert: true, cacheControl: "60" });
      if (error) throw new Error(error.message);
      const url = `${supabase.storage.from("forms").getPublicUrl(path).data.publicUrl}?v=${Date.now()}`;
      const res = await setApplicationPdf({ url });
      if (!res.ok) throw new Error(res.error);
      setMessage({ ok: true, text: "Saved. The download button is now on the Apply page." });
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
        {busy ? "Uploading…" : hasFile ? "Replace the PDF" : "Choose the PDF form"}
        <input type="file" accept="application/pdf" className="sr-only" disabled={busy} onChange={(e) => { void onPick(e.target.files?.[0]); e.target.value = ""; }} />
      </label>
      {message && <p role={message.ok ? "status" : "alert"} className={`rounded-lg p-2 text-sm font-semibold ${message.ok ? "bg-brand-green-soft text-brand-green-dark" : "bg-red-50 text-red-700"}`}>{message.text}</p>}
    </div>
  );
}
