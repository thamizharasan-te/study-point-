import type { Metadata } from "next";
import { AdminHeading, Card, Help, Notice } from "@/components/admin/Layout";
import { ThemePicker } from "@/components/admin/ThemePicker";
import { SubmitButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import type { SiteImages } from "@/lib/types";
import { saveTheme } from "./actions";

export const metadata: Metadata = { title: "Theme" };

export default async function AdminTheme({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_content").select("value").eq("key", "images").maybeSingle();
  const theme = (data?.value as SiteImages | undefined)?.theme ?? "";

  return (
    <>
      <AdminHeading title="Theme" tamil="தளத்தின் நிறத் தீம் — ஒன்றைத் தேர்ந்தால் எல்லா நிறங்களும் மாறும்" />
      <Notice saved={saved} error={error} />
      <Help>
        Pick a theme and every colour on the website changes together: header, buttons, headings, cards, top bars and footer.
        You can change it any time; your text and photos are not affected.
      </Help>
      <Card>
        <form action={saveTheme} className="space-y-4">
          <ThemePicker initial={theme} />
          <SubmitButton>Save theme</SubmitButton>
        </form>
      </Card>
    </>
  );
}
