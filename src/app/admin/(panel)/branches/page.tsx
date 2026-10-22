import type { Metadata } from "next";
import { AdminHeading, Card, ConfirmedCheckbox, Help, Notice } from "@/components/admin/Layout";
import { SubmitButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import type { Branch } from "@/lib/types";
import { saveBranch } from "./actions";

export const metadata: Metadata = { title: "Branches" };

export default async function AdminBranches({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("branches").select("*").order("sort_order");
  const branches = (data ?? []) as Branch[];

  return (
    <>
      <AdminHeading title="Branches" tamil="கிளைகளின் முகவரி, தொலைபேசி, நேரம், வரைபடம்" />
      <Notice saved={saved} error={error} />
      <Help>
        <strong>Map link:</strong> open your branch on Google Maps → Share → <em>Embed a map</em> → copy the link inside <code>src=&quot;…&quot;</code>.
        If you leave it empty, the website shows a map found from the branch name.
      </Help>
      {branches.length === 0 && <Card><p>No branches found. Run supabase/seed.sql first.</p></Card>}
      <div className="space-y-6">
        {branches.map((b) => (
          <Card key={b.id}>
            <h2 className="mb-3 text-xl font-bold text-brand-navy">{b.name}</h2>
            <form action={saveBranch} className="space-y-3">
              <input type="hidden" name="id" value={b.id} />
              <div>
                <label className="label" htmlFor={`address-${b.id}`}>Address</label>
                <textarea id={`address-${b.id}`} name="address" rows={2} defaultValue={b.address} className="input" maxLength={300} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor={`phones-${b.id}`}>Phone numbers (one per line)</label>
                  <textarea id={`phones-${b.id}`} name="phones" rows={2} defaultValue={b.phones.join("\n")} className="input" />
                </div>
                <div>
                  <label className="label" htmlFor={`wa-${b.id}`}>WhatsApp number</label>
                  <input id={`wa-${b.id}`} name="whatsapp" defaultValue={b.whatsapp} className="input" inputMode="tel" maxLength={30} />
                </div>
              </div>
              <div>
                <label className="label" htmlFor={`hours-${b.id}`}>Opening hours</label>
                <input id={`hours-${b.id}`} name="hours" defaultValue={b.hours} className="input" maxLength={200} />
              </div>
              <div>
                <label className="label" htmlFor={`map-${b.id}`}>Map link (optional)</label>
                <input id={`map-${b.id}`} name="map_url" defaultValue={b.map_url} className="input" inputMode="url" maxLength={1000} />
              </div>
              <ConfirmedCheckbox defaultChecked={!b.is_placeholder} label="These details are correct" />
              <SubmitButton>Save {b.name}</SubmitButton>
            </form>
          </Card>
        ))}
      </div>
    </>
  );
}
