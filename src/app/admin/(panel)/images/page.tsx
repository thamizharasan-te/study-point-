import type { Metadata } from "next";
import { RotateCcw } from "lucide-react";
import { AdminHeading, Card, Help, Notice } from "@/components/admin/Layout";
import { ImageSlotUploader } from "@/components/admin/ImageSlotUploader";
import { ConfirmButton } from "@/components/admin/ui";
import { SmartImage } from "@/components/SmartImage";
import { requireAdmin } from "@/lib/admin";
import { IMAGE_SLOTS } from "@/lib/defaults";
import { slotImage } from "@/lib/images";
import type { ImageSlot, SiteImages } from "@/lib/types";
import { resetSiteImage } from "./actions";

export const metadata: Metadata = { title: "Main Pictures" };

export default async function AdminImages({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_content").select("value").eq("key", "images").maybeSingle();
  const images = (data?.value as SiteImages | undefined) ?? {};

  return (
    <>
      <AdminHeading title="Main Pictures" tamil="முகப்பு மற்றும் பக்கங்களின் முக்கியப் படங்களை மாற்றவும்" />
      <Notice saved={saved} error={error} />
      <Help>
        The pictures below are temporary illustrations until you upload real photos. Use clear, bright photos of your own
        children and classrooms (with parents&apos; permission). Landscape photos work best. They are resized automatically.
      </Help>
      <div className="grid gap-4 md:grid-cols-2">
        {(Object.keys(IMAGE_SLOTS) as ImageSlot[]).map((slot) => {
          const meta = IMAGE_SLOTS[slot];
          const pic = slotImage(images, slot);
          const custom = Boolean(images[slot]);
          return (
            <Card key={slot} className="space-y-3">
              <div>
                <h2 className="text-lg font-bold text-brand-navy">{meta.label}</h2>
                <p className="text-sm text-gray-600">{meta.where}</p>
              </div>
              <SmartImage src={pic.src} alt={pic.alt} width={pic.width} height={pic.height} sizes="(min-width:768px) 400px, 100vw" className="aspect-[4/3] w-full rounded-xl object-cover" />
              <p className="text-xs font-semibold text-gray-500">{custom ? "Your photo is showing." : "Temporary illustration is showing."}</p>
              <ImageSlotUploader slot={slot} />
              {custom && (
                <form action={resetSiteImage}>
                  <input type="hidden" name="slot" value={slot} />
                  <ConfirmButton message="Remove your photo and go back to the illustration?" className="btn !min-h-9 !px-3 !py-1.5 text-gray-700 hover:bg-gray-100">
                    <RotateCcw className="h-4 w-4" aria-hidden /> Use the illustration again
                  </ConfirmButton>
                </form>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}
