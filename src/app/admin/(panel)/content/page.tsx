import type { Metadata } from "next";
import { AdminHeading, Card, Notice } from "@/components/admin/Layout";
import { ProgramsEditor } from "@/components/admin/ProgramsEditor";
import { SubmitButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import { DEFAULT_CLASS_PROGRAMS, DEFAULT_HERO, DEFAULT_NURSERY_PROGRAMS } from "@/lib/defaults";
import type { HeroContent, Program } from "@/lib/types";
import { saveHero, savePrograms } from "./actions";

export const metadata: Metadata = { title: "Website Text" };

export default async function AdminContent({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_content").select("key,value");
  const byKey = new Map((data ?? []).map((r) => [r.key as string, r.value]));
  const hero = { ...DEFAULT_HERO, ...(byKey.get("hero") as Partial<HeroContent> | undefined) };
  const nursery = (byKey.get("nursery_programs") as Program[] | undefined) ?? DEFAULT_NURSERY_PROGRAMS;
  const classes = (byKey.get("class_programs") as Program[] | undefined) ?? DEFAULT_CLASS_PROGRAMS;

  return (
    <>
      <AdminHeading title="Website Text" tamil="முகப்புப் பக்க தலைப்பு மற்றும் பாடத்திட்டப் பட்டியல்கள்" />
      <Notice saved={saved} error={error} />

      <Card className="mb-6">
        <h2 className="mb-3 text-lg font-bold text-brand-navy">Home page main heading</h2>
        <form action={saveHero} className="space-y-3">
          <div>
            <label className="label" htmlFor="eyebrow">Small line above the heading</label>
            <input id="eyebrow" name="eyebrow" defaultValue={hero.eyebrow} className="input" maxLength={60} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div><label className="label" htmlFor="line1">Heading line 1 (dark)</label><input id="line1" name="line1" defaultValue={hero.line1} required className="input" maxLength={40} /></div>
            <div><label className="label" htmlFor="line2">Heading line 2 (green)</label><input id="line2" name="line2" defaultValue={hero.line2} required className="input" maxLength={40} /></div>
            <div><label className="label" htmlFor="line3">Heading line 3 (pink)</label><input id="line3" name="line3" defaultValue={hero.line3} required className="input" maxLength={40} /></div>
          </div>
          <div>
            <label className="label" htmlFor="subtitle">Sentence under the heading</label>
            <textarea id="subtitle" name="subtitle" rows={2} defaultValue={hero.subtitle} className="input" maxLength={240} />
          </div>
          <SubmitButton>Save heading</SubmitButton>
        </form>
      </Card>

      <Card className="mb-6">
        <h2 className="mb-1 text-lg font-bold text-brand-navy">Nursery — what children learn</h2>
        <p className="mb-3 text-sm text-gray-600">Shown on the Nursery page and the home page.</p>
        <form action={savePrograms} className="space-y-3">
          <input type="hidden" name="key" value="nursery_programs" />
          <ProgramsEditor name="programs" idPrefix="nursery" initial={nursery} />
          <SubmitButton>Save Nursery list</SubmitButton>
        </form>
      </Card>

      <Card>
        <h2 className="mb-1 text-lg font-bold text-brand-navy">Study Point Classes — what we teach</h2>
        <p className="mb-3 text-sm text-gray-600">Shown on the Classes page and the home page.</p>
        <form action={savePrograms} className="space-y-3">
          <input type="hidden" name="key" value="class_programs" />
          <ProgramsEditor name="programs" idPrefix="classes" initial={classes} />
          <SubmitButton>Save Classes list</SubmitButton>
        </form>
      </Card>
    </>
  );
}
