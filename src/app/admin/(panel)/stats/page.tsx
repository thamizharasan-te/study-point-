import type { Metadata } from "next";
import { AdminHeading, Card, Help, Notice } from "@/components/admin/Layout";
import { SubmitButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import { DEFAULT_STATS } from "@/lib/defaults";
import type { SiteStat } from "@/lib/types";
import { saveStats } from "./actions";

export const metadata: Metadata = { title: "Numbers" };

const HINTS: Record<string, string> = {
  children: "e.g. 250+",
  years: "e.g. 5+",
  branches: "e.g. 2",
  satisfaction: "e.g. 90%",
};

export default async function AdminStats({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_stats").select("*");
  const byKey = new Map(((data ?? []) as SiteStat[]).map((s) => [s.key, s]));

  return (
    <>
      <AdminHeading title="Numbers" tamil="முகப்புப் பக்க எண்ணிக்கைகள்" />
      <Notice saved={saved} error={error} />
      <Help>
        The numbers below are <strong>examples</strong> until you enter your real figures. Only tick “Confirmed” when the number is true —
        otherwise the website shows a “Sample” tag next to it.
      </Help>
      <form action={saveStats} className="space-y-4">
        {DEFAULT_STATS.map((d) => {
          const s = byKey.get(d.key) ?? d;
          return (
            <Card key={d.key}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor={`value_${d.key}`}>Number</label>
                  <input id={`value_${d.key}`} name={`value_${d.key}`} defaultValue={s.value} required maxLength={20} placeholder={HINTS[d.key]} className="input" />
                </div>
                <div>
                  <label className="label" htmlFor={`label_${d.key}`}>Label</label>
                  <input id={`label_${d.key}`} name={`label_${d.key}`} defaultValue={s.label} required maxLength={40} className="input" />
                </div>
              </div>
              <label className="mt-3 flex items-center gap-3 text-sm font-semibold">
                <input type="checkbox" name={`confirmed_${d.key}`} defaultChecked={!s.is_placeholder} className="h-5 w-5 accent-brand-green" /> Confirmed — this number is correct
              </label>
            </Card>
          );
        })}
        <SubmitButton>Save numbers</SubmitButton>
      </form>
    </>
  );
}
