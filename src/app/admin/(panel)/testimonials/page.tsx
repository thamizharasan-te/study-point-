import type { Metadata } from "next";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { AdminHeading, Card, ConfirmedCheckbox, Help, Notice, TamilField, TamilSetupHelp } from "@/components/admin/Layout";
import { ConfirmButton, SubmitButton } from "@/components/admin/ui";
import { SampleTag } from "@/components/SampleTag";
import { hasColumn, requireAdmin } from "@/lib/admin";
import { taValue } from "@/lib/i18n/localize";
import type { Testimonial } from "@/lib/types";
import { deleteTestimonial, saveTestimonial, toggleTestimonial } from "./actions";

export const metadata: Metadata = { title: "Parent Comments" };

function Fields({ t, tamil }: { t?: Testimonial; tamil: boolean }) {
  return (
    <div className="space-y-3">
      {t && <input type="hidden" name="id" value={t.id} />}
      <div>
        <label className="label" htmlFor={`quote-${t?.id ?? "new"}`}>Comment</label>
        <textarea id={`quote-${t?.id ?? "new"}`} name="quote" rows={3} required maxLength={600} defaultValue={t?.quote} className="input" />
      </div>
      {tamil && <TamilField id={`quote-ta-${t?.id ?? "new"}`} name="quote_ta" label="Comment" rows={3} defaultValue={t ? taValue(t.quote, t.quote_ta) : ""} maxLength={600} />}
      <div>
        <label className="label" htmlFor={`author-${t?.id ?? "new"}`}>Parent name (or “A Proud Parent”)</label>
        <input id={`author-${t?.id ?? "new"}`} name="author" maxLength={80} defaultValue={t?.author} className="input" />
      </div>
      <label className="flex items-center gap-3 text-sm font-semibold">
        <input type="checkbox" name="is_visible" defaultChecked={t?.is_visible ?? true} className="h-5 w-5 accent-brand-green" /> Show on the website
      </label>
      <ConfirmedCheckbox defaultChecked={t ? !t.is_placeholder : true} label="This is a real comment from a parent" />
    </div>
  );
}

export default async function AdminTestimonials({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await searchParams;
  const { supabase } = await requireAdmin();
  const [{ data }, tamilReady] = await Promise.all([supabase.from("testimonials").select("*").order("sort_order").order("created_at"), hasColumn(supabase, "testimonials", "quote_ta")]);
  const items = (data ?? []) as Testimonial[];

  return (
    <>
      <AdminHeading title="Parent Comments" tamil="பெற்றோர் கருத்துகளைச் சேர்க்க, திருத்த, காட்ட, மறைக்க" />
      <Notice saved={saved} error={error} />
      {!tamilReady && <TamilSetupHelp />}
      {items.some((t) => t.is_placeholder) && (
        <Help>The comments marked <strong>Sample</strong> are examples, not real parents. Replace them with genuine feedback (with the parent&apos;s permission) or delete them.</Help>
      )}

      <Card className="mb-6">
        <h2 className="mb-3 text-lg font-bold text-brand-navy">Add a comment</h2>
        <form action={saveTestimonial} className="space-y-3">
          <Fields tamil={tamilReady} />
          <SubmitButton>Add comment</SubmitButton>
        </form>
      </Card>

      <ul className="space-y-3">
        {items.map((t) => (
          <li key={t.id}>
            <Card>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${t.is_visible ? "bg-brand-green-soft text-brand-green-dark" : "bg-gray-200 text-gray-700"}`}>{t.is_visible ? "Shown" : "Hidden"}</span>
                {t.is_placeholder && <SampleTag label="Sample" always />}
              </div>
              <form action={saveTestimonial} className="space-y-3">
                <Fields t={t} tamil={tamilReady} />
                <SubmitButton className="btn-navy">Save changes</SubmitButton>
              </form>
              <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
                <form action={toggleTestimonial}>
                  <input type="hidden" name="id" value={t.id} />
                  <input type="hidden" name="show" value={String(!t.is_visible)} />
                  <SubmitButton className="btn border border-gray-300 !min-h-9 !py-1.5" pendingText="…">
                    {t.is_visible ? <><EyeOff className="h-4 w-4" aria-hidden /> Hide</> : <><Eye className="h-4 w-4" aria-hidden /> Show</>}
                  </SubmitButton>
                </form>
                <form action={deleteTestimonial} className="ml-auto">
                  <input type="hidden" name="id" value={t.id} />
                  <ConfirmButton message="Delete this comment? This cannot be undone." className="btn !min-h-9 !py-1.5 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" aria-hidden /> Delete</ConfirmButton>
                </form>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
