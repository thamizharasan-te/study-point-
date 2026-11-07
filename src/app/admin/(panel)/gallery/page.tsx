import type { Metadata } from "next";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { AdminHeading, Card, Help, Notice, TamilSetupHelp } from "@/components/admin/Layout";
import { GalleryUploader } from "@/components/admin/GalleryUploader";
import { Pager } from "@/components/admin/Pager";
import { ConfirmButton, SubmitButton } from "@/components/admin/ui";
import { SampleTag } from "@/components/SampleTag";
import { SmartImage } from "@/components/SmartImage";
import { hasColumn, requireAdmin } from "@/lib/admin";
import { GALLERY_ALBUMS } from "@/lib/defaults";
import type { GalleryItem } from "@/lib/types";
import { deleteGalleryItem, moveGalleryItem, saveGalleryPage } from "./actions";

export const metadata: Metadata = { title: "Gallery" };

const PAGE_SIZE = 10; // photos per page in the admin list

export default async function AdminGallery({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string; page?: string }> }) {
  const { saved, error, page: pageParam } = await searchParams;
  const { supabase } = await requireAdmin();
  const tamilReady = await hasColumn(supabase, "gallery_items", "alt_ta");
  // Newest first, the same order as the website. Only the current page is loaded.
  const wanted = Math.max(1, Math.floor(Number(pageParam)) || 1);
  const list = () => supabase.from("gallery_items").select("*", { count: "exact" }).order("sort_order", { ascending: false }).order("created_at", { ascending: false });
  const firstTry = await list().range((wanted - 1) * PAGE_SIZE, wanted * PAGE_SIZE - 1);
  let data = firstTry.data;
  const count = firstTry.count;
  const total = count ?? data?.length ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(wanted, pages);
  if (page !== wanted) ({ data } = await list().range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)); // e.g. the last photo of the last page was deleted
  const items = (data ?? []) as GalleryItem[];
  const first = (page - 1) * PAGE_SIZE;
  const hasSamples = items.some((i) => i.is_sample);

  return (
    <>
      <AdminHeading title="Gallery" tamil="படங்களை ஏற்றவும், வரிசைப்படுத்தவும், அழிக்கவும்" />
      <Notice saved={saved} error={error} />

      <Card className="mb-6">
        <h2 className="mb-3 text-lg font-bold text-brand-navy">Add photos</h2>
        <GalleryUploader />
      </Card>

      {hasSamples && (
        <Help>
          Photos marked <strong>Sample</strong> are temporary placeholder pictures. Upload your real photos above, then delete the samples.
        </Help>
      )}

      <h2 className="mb-3 text-lg font-bold text-brand-navy">Your photos ({total})</h2>
      <p className="mb-3 text-sm text-gray-600">The newest photos are first, and the website shows them in this order. Use the arrows to move a photo towards the front (Up) or the back (Down).</p>
      {total === 0 && <Card><p className="text-gray-600">No photos yet.</p></Card>}

      <Pager page={page} total={pages} href={(n) => (n === 1 ? "/admin/gallery" : `/admin/gallery?page=${n}`)} />
      {!tamilReady && <TamilSetupHelp />}
      <Help>
        Describe what is in each photo in a few words, for example <em>“Study Point students on stage at the elocution exam”</em>.
        It is read aloud to blind visitors and helps Google understand the photo. Give every photo its own description, and a Tamil one for the Tamil pages.
        After typing, press <strong>Save descriptions on this page</strong> (once for all {items.length} photos below).
      </Help>
      <form id="gallery-form" action={saveGalleryPage} className="mb-3">
        <input type="hidden" name="page" value={page} />
        <SubmitButton className="btn-navy">Save descriptions on this page</SubmitButton>
      </form>
      <ol className="space-y-3">
        {items.map((g, i) => (
          <li key={g.id}>
            <Card className="grid gap-4 sm:grid-cols-[160px_1fr]">
              <div>
                <SmartImage src={g.image_url} alt={g.alt} width={320} height={240} sizes="160px" className="aspect-[4/3] w-full rounded-xl object-cover" />
                {g.is_sample && <div className="mt-2"><SampleTag label="Sample" always /></div>}
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  {/* These boxes belong to the one "Save" form of the page (see form="gallery-form"), so a whole page is saved at once. */}
                  <input type="hidden" name="id" value={g.id} form="gallery-form" />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor={`album-${g.id}`}>Album</label>
                      <input id={`album-${g.id}`} name="album" form="gallery-form" list="albums-list" defaultValue={g.album} className="input" maxLength={40} />
                    </div>
                    <div>
                      <label className="label" htmlFor={`alt-${g.id}`}>Description</label>
                      <input id={`alt-${g.id}`} name="alt" form="gallery-form" defaultValue={g.alt} className="input" maxLength={140} placeholder="What is in this photo?" />
                    </div>
                  </div>
                  {tamilReady && (
                    <div>
                      <label className="label" htmlFor={`alt-ta-${g.id}`}>Description <span className="font-normal text-gray-500">(தமிழ்)</span></label>
                      <input id={`alt-ta-${g.id}`} name="alt_ta" form="gallery-form" defaultValue={g.alt_ta ?? ""} lang="ta" className="input" maxLength={140} placeholder="இந்தப் படத்தில் என்ன இருக்கிறது?" />
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 border-t pt-3">
                  <form action={moveGalleryItem}>
                    <input type="hidden" name="id" value={g.id} /><input type="hidden" name="page" value={page} /><input type="hidden" name="dir" value="up" />
                    <button type="submit" disabled={first + i === 0} aria-label={`Move photo ${first + i + 1} up`} className="btn border border-gray-300 !min-h-9 !px-3 !py-1.5 disabled:opacity-40"><ArrowUp className="h-4 w-4" aria-hidden /> Up</button>
                  </form>
                  <form action={moveGalleryItem}>
                    <input type="hidden" name="id" value={g.id} /><input type="hidden" name="page" value={page} /><input type="hidden" name="dir" value="down" />
                    <button type="submit" disabled={first + i === total - 1} aria-label={`Move photo ${first + i + 1} down`} className="btn border border-gray-300 !min-h-9 !px-3 !py-1.5 disabled:opacity-40"><ArrowDown className="h-4 w-4" aria-hidden /> Down</button>
                  </form>
                  <form action={deleteGalleryItem} className="ml-auto">
                    <input type="hidden" name="id" value={g.id} /><input type="hidden" name="page" value={page} />
                    <ConfirmButton message="Delete this photo? This cannot be undone." className="btn !min-h-9 !px-3 !py-1.5 text-red-600 hover:bg-red-50" aria-label={`Delete photo ${first + i + 1}`}>
                      <Trash2 className="h-4 w-4" aria-hidden /> Delete
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ol>
      <div className="mt-4">
        <button type="submit" form="gallery-form" className="btn-navy">Save descriptions on this page</button>
      </div>
      <Pager page={page} total={pages} href={(n) => (n === 1 ? "/admin/gallery" : `/admin/gallery?page=${n}`)} />
      <datalist id="albums-list">{GALLERY_ALBUMS.map((a) => <option key={a} value={a} />)}</datalist>
    </>
  );
}
