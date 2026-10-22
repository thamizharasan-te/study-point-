import type { Metadata } from "next";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { AdminHeading, Card, Help, Notice } from "@/components/admin/Layout";
import { ConfirmButton, SubmitButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import type { Announcement } from "@/lib/types";
import { addAnnouncement, deleteAnnouncement, toggleAnnouncement } from "./actions";

export const metadata: Metadata = { title: "Announcements" };

export default async function AdminAnnouncements({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
  const items = (data ?? []) as Announcement[];

  return (
    <>
      <AdminHeading title="Announcements" tamil="முகப்புப் பக்கத்தில் காட்டும் குறுகிய அறிவிப்புகள்" />
      <Notice saved={saved} error={error} />
      <Help>Short notices (for example “Admissions open for 2027” or “Closed on Friday”) appear in a blue bar at the very top of every page.</Help>

      <Card className="mb-6">
        <form action={addAnnouncement} className="space-y-3">
          <label className="label" htmlFor="text">New announcement</label>
          <input id="text" name="text" required maxLength={200} className="input" placeholder="Type a short notice…" />
          <SubmitButton>Publish</SubmitButton>
        </form>
      </Card>

      {items.length === 0 && <Card><p className="text-gray-600">No announcements yet.</p></Card>}
      <ul className="space-y-3">
        {items.map((a) => (
          <li key={a.id}>
            <Card className="flex flex-wrap items-center gap-3">
              <p className="min-w-0 flex-1 font-semibold">{a.text}</p>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${a.is_active ? "bg-brand-green-soft text-brand-green-dark" : "bg-gray-200 text-gray-700"}`}>{a.is_active ? "Live" : "Hidden"}</span>
              <form action={toggleAnnouncement}>
                <input type="hidden" name="id" value={a.id} /><input type="hidden" name="active" value={String(!a.is_active)} />
                <SubmitButton className="btn border border-gray-300 !min-h-9 !py-1.5" pendingText="…">
                  {a.is_active ? <><EyeOff className="h-4 w-4" aria-hidden /> Hide</> : <><Eye className="h-4 w-4" aria-hidden /> Show</>}
                </SubmitButton>
              </form>
              <form action={deleteAnnouncement}>
                <input type="hidden" name="id" value={a.id} />
                <ConfirmButton message="Delete this announcement?" className="btn !min-h-9 !py-1.5 text-red-600 hover:bg-red-50" aria-label="Delete announcement"><Trash2 className="h-4 w-4" aria-hidden /> Delete</ConfirmButton>
              </form>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
