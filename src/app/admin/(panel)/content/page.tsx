import type { Metadata } from "next";
import { AdminHeading, Card, Notice, TamilField } from "@/components/admin/Layout";
import { ProgramsEditor } from "@/components/admin/ProgramsEditor";
import { SubmitButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import { taValue } from "@/lib/i18n/localize";
import { DEFAULT_CLASS_PROGRAMS, DEFAULT_FAQ, DEFAULT_HERO, DEFAULT_NURSERY_PROGRAMS, DEFAULT_SOCIAL } from "@/lib/defaults";
import type { HeroContent, Program, Social } from "@/lib/types";
import { saveHero, savePrograms, saveSocial } from "./actions";

export const metadata: Metadata = { title: "Website Text" };

export default async function AdminContent({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_content").select("key,value");
  const byKey = new Map((data ?? []).map((r) => [r.key as string, r.value]));
  const hero = { ...DEFAULT_HERO, ...(byKey.get("hero") as Partial<HeroContent> | undefined) };
  const nursery = (byKey.get("nursery_programs") as Program[] | undefined) ?? DEFAULT_NURSERY_PROGRAMS;
  const classes = (byKey.get("class_programs") as Program[] | undefined) ?? DEFAULT_CLASS_PROGRAMS;

  // Pre-fill each Tamil box with the Tamil the website currently shows, so it can be edited.
  const withTa = (list: Program[]) => list.map((p) => ({ ...p, title_ta: taValue(p.title, p.title_ta), description_ta: taValue(p.description, p.description_ta) }));
  const heroTa = hero.ta ?? {};
  const faq = (byKey.get("faq") as Program[] | undefined) ?? DEFAULT_FAQ;
  const social = { ...DEFAULT_SOCIAL, ...(byKey.get("social") as Partial<Social> | undefined) };

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
          <div className="space-y-3 border-t pt-3">
            <p className="text-sm font-bold text-brand-navy">தமிழ் version (Tamil)</p>
            <TamilField id="ta_eyebrow" name="ta_eyebrow" label="Small line" defaultValue={taValue(hero.eyebrow, heroTa.eyebrow)} maxLength={80} />
            <div className="grid gap-3 sm:grid-cols-3">
              <TamilField id="ta_line1" name="ta_line1" label="Line 1" defaultValue={taValue(hero.line1, heroTa.line1)} maxLength={60} />
              <TamilField id="ta_line2" name="ta_line2" label="Line 2" defaultValue={taValue(hero.line2, heroTa.line2)} maxLength={60} />
              <TamilField id="ta_line3" name="ta_line3" label="Line 3" defaultValue={taValue(hero.line3, heroTa.line3)} maxLength={60} />
            </div>
            <TamilField id="ta_subtitle" name="ta_subtitle" label="Sentence under the heading" rows={2} defaultValue={taValue(hero.subtitle, heroTa.subtitle)} maxLength={300} />
          </div>
          <SubmitButton>Save heading</SubmitButton>
        </form>
      </Card>

      <Card className="mb-6">
        <h2 className="mb-1 text-lg font-bold text-brand-navy">Nursery — what children learn</h2>
        <p className="mb-3 text-sm text-gray-600">Shown on the Nursery page and the home page.</p>
        <form action={savePrograms} className="space-y-3">
          <input type="hidden" name="key" value="nursery_programs" />
          <ProgramsEditor name="programs" idPrefix="nursery" initial={withTa(nursery)} />
          <SubmitButton>Save Nursery list</SubmitButton>
        </form>
      </Card>

      <Card className="mb-6">
        <h2 className="mb-1 text-lg font-bold text-brand-navy">Study Point Classes — what we teach</h2>
        <p className="mb-3 text-sm text-gray-600">Shown on the Classes page and the home page.</p>
        <form action={savePrograms} className="space-y-3">
          <input type="hidden" name="key" value="class_programs" />
          <ProgramsEditor name="programs" idPrefix="classes" initial={withTa(classes)} />
          <SubmitButton>Save Classes list</SubmitButton>
        </form>
      </Card>

      <Card className="mb-6">
        <h2 className="mb-1 text-lg font-bold text-brand-navy">Frequently asked questions</h2>
        <p className="mb-3 text-sm text-gray-600">Shown on the home page. Only write answers that are true — for example fees and timings.</p>
        <form action={savePrograms} className="space-y-3">
          <input type="hidden" name="key" value="faq" />
          <ProgramsEditor name="programs" idPrefix="faq" initial={withTa(faq)} titleLabel="Question" descLabel="Answer" maxDesc={600} />
          <SubmitButton>Save questions</SubmitButton>
        </form>
      </Card>

      <Card>
        <h2 className="mb-1 text-lg font-bold text-brand-navy">Social media links</h2>
        <p className="mb-3 text-sm text-gray-600">Paste the full page address (starting with https://). Leave empty to hide an icon.</p>
        <form action={saveSocial} className="space-y-3">
          {(["facebook", "instagram", "youtube"] as const).map((k) => (
            <div key={k}>
              <label className="label capitalize" htmlFor={`social-${k}`}>{k}</label>
              <input id={`social-${k}`} name={k} defaultValue={social[k]} inputMode="url" maxLength={300} placeholder="https://…" className="input" />
            </div>
          ))}
          <SubmitButton>Save links</SubmitButton>
        </form>
      </Card>
    </>
  );
}
