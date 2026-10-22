import { SHOW_SAMPLE } from "@/lib/sample";

/**
 * Marks content that is NOT confirmed client data. On the public site it only
 * appears when SHOW_SAMPLE_CONTENT=true (preview); the admin passes `always`.
 */
export function SampleTag({ label = "Sample — to be confirmed", always = false }: { label?: string; always?: boolean }) {
  if (!SHOW_SAMPLE && !always) return null;
  return (
    <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
      {label}
    </span>
  );
}
