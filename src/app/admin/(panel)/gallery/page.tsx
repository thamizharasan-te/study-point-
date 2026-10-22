import type { Metadata } from "next";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { AdminHeading, Card, Help, Notice } from "@/components/admin/Layout";
import { GalleryUploader } from "@/components/admin/GalleryUploader";
import { ConfirmButton, SubmitButton } from "@/components/admin/ui";
import { SampleTag } from "@/components/SampleTag";
import { SmartImage } from "@/components/SmartImage";
import { requireAdmin } from "@/lib/admin";
import { GALLERY_ALBUMS } from "@/lib/defaults";
import type { GalleryItem } from "@/lib/types";
import { deleteGalleryItem, moveGalleryItem, updateGalleryItem } from "./actions";

export const metadata: Metadata = { title: "Gallery" };

export default async function AdminGallery({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("gallery_items").select("*").order("sort_order").order("created_at");
  const items = (data ?? []) as GalleryItem[];

  return (
    <>
      <AdminHeading title="Gallery" tamil="படங்களை ஏற்றவும், வரிசைப்படுத்தவும், அழிக்கவும்" />
      <Notice saved={saved} error={error} />

      <Card className="mb-6">
        <h2 className="mb-3 text-lg font-bold text-brand-navy">Add photos</h2>
        <GalleryUploader />
      </Card>

      {items.some((i) => i.is_sample) && (
        <Help>
          Photos marked <strong>Sample</strong> are temporary placeholder pictures. Upload your real photos above, then delete the samples.
        </Help>
      )}

      <h2 className="mb-3 text-lg font-bold text-brand-navy">Your photos ({items.length})</h2>
      <p className="mb-3 text-sm text-gray-600">The website shows photos in this order. Use the arrows to move a photo up or down.</p>
      {items.length === 0 && <Card><p className="text-gray-600">No photos yet.</p></Card>}

      <ol className="space-y-3">
        {items.map((g, i) => (
          <li key={g.id}>
            <Card className="grid gap-4 sm:grid-cols-[160px_1fr]">
              <div>
                <SmartImage src={g.image_url} alt={g.alt} width={320} height={240} sizes="160px" className="aspect-[4/3] w-full rounded-xl object-cover" />
                {g.is_sample && <div className="mt-2"><SampleTag label="Sample" always /></div>}
              </div>
              <div className="space-y-3">
                <form action={updateGalleryItem} className="space-y-2">
                  <input type="hidden" name="id" value={g.id} />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor={`album-${g.id}`}>Album</label>
                      <input id={`album-${g.id}`} name="album" list="albums-list" defaultValue={g.album} className="input" maxLength={40} />
                    </div>
                    <div>
                      <label className="label" htmlFor={`alt-${g.id}`}>Description</label>
                      <input id={`alt-${g.id}`} name="alt" defaultValue={g.alt} className="input" maxLength={140} />
                    </div>
                  </div>
                  <SubmitButton className="btn-navy !min-h-9 !py-1.5">Save details</SubmitButton>
                </form>
                <div className="flex flex-wrap items-center gap-2 border-t pt-3">
                  <form action={moveGalleryItem}>
                    <input type="hidden" name="id" value={g.id} /><input type="hidden" name="dir" value="up" />
                    <button type="submit" disabled={i === 0} aria-label={`Move photo ${i + 1} up`} className="btn border border-gray-300 !min-h-9 !px-3 !py-1.5 disabled:opacity-40"><ArrowUp className="h-4 w-4" aria-hidden /> Up</button>
                  </form>
                  <form action={moveGalleryItem}>
                    <input type="hidden" name="id" value={g.id} /><input type="hidden" name="dir" value="down" />
                    <button type="submit" disabled={i === items.length - 1} aria-label={`Move photo ${i + 1} down`} className="btn border border-gray-300 !min-h-9 !px-3 !py-1.5 disabled:opacity-40"><ArrowDown className="h-4 w-4" aria-hidden /> Down</button>
                  </form>
                  <form action={deleteGalleryItem} className="ml-auto">
                    <input type="hidden" name="id" value={g.id} />
                    <ConfirmButton message="Delete this photo? This cannot be undone." className="btn !min-h-9 !px-3 !py-1.5 text-red-600 hover:bg-red-50" aria-label={`Delete photo ${i + 1}`}>
                      <Trash2 className="h-4 w-4" aria-hidden /> Delete
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ol>
      <datalist id="albums-list">{GALLERY_ALBUMS.map((a) => <option key={a} value={a} />)}</datalist>
    </>
  );
}
