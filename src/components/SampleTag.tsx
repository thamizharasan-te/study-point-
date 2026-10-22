/**
 * Marks content that is NOT confirmed client data (sample numbers, sample
 * quotes, unconfirmed addresses). It disappears once the client edits and
 * saves the item in /admin.
 */
export function SampleTag({ label = "Sample — to be confirmed" }: { label?: string }) {
  return (
    <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
      {label}
    </span>
  );
}
