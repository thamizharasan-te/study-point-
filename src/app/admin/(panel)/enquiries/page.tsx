import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone, Trash2 } from "lucide-react";
import clsx from "clsx";
import { AdminHeading, Card, Notice } from "@/components/admin/Layout";
import { ConfirmButton, SubmitButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import type { Enquiry, EnquiryStatus } from "@/lib/types";
import { telLink, whatsAppLink } from "@/lib/utils";
import { deleteEnquiry, setStatus } from "./actions";

export const metadata: Metadata = { title: "Enquiries" };

const FILTERS: { value: "all" | EnquiryStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "joined", label: "Joined" },
];
const BADGE: Record<EnquiryStatus, string> = {
  new: "bg-brand-pink text-white",
  contacted: "bg-amber-100 text-amber-800",
  joined: "bg-brand-green text-white",
};

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string; saved?: string; error?: string }> }) {
  const { status = "all", saved, error } = await searchParams;
  const { supabase } = await requireAdmin();

  let q = supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(300);
  if (status !== "all") q = q.eq("status", status);
  const { data } = await q;
  const rows = (data ?? []) as Enquiry[];

  return (
    <>
      <AdminHeading title="Enquiries" tamil="இணையத்தளம் மூலம் வந்த விசாரணைகள்" />
      <Notice saved={saved} error={error} />

      <div role="group" aria-label="Filter by status" className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/admin/enquiries" : `/admin/enquiries?status=${f.value}`}
            aria-current={status === f.value ? "page" : undefined}
            className={clsx("rounded-full px-4 py-2 text-sm font-bold", status === f.value ? "bg-brand-navy text-white" : "bg-white text-brand-navy ring-1 ring-gray-200")}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {rows.length === 0 && <Card><p className="text-gray-600">No enquiries here yet.</p></Card>}

      <ul className="space-y-3">
        {rows.map((e) => {
          const msg = `Hello ${e.parent_name}, this is Study Point. Thank you for your enquiry${e.child_name ? ` about ${e.child_name}` : ""}.`;
          return (
            <li key={e.id}>
              <Card className="[overflow-wrap:anywhere]">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-brand-navy">{e.parent_name}</h2>
                    <p className="text-xs text-gray-500">{new Date(e.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Colombo" })}</p>
                  </div>
                  <span className={clsx("rounded-full px-3 py-1 text-xs font-bold uppercase", BADGE[e.status])}>{e.status}</span>
                </div>

                <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                  <div><dt className="inline font-semibold">Phone: </dt><dd className="inline"><a href={telLink(e.phone)} className="text-brand-navy underline">{e.phone}</a></dd></div>
                  <div><dt className="inline font-semibold">Interested in: </dt><dd className="inline">{e.interest}</dd></div>
                  {e.child_name && <div><dt className="inline font-semibold">Child: </dt><dd className="inline">{e.child_name}{e.child_age ? `, ${e.child_age}` : ""}</dd></div>}
                  {e.branch && <div><dt className="inline font-semibold">Branch: </dt><dd className="inline">{e.branch}</dd></div>}
                </dl>
                {e.message && <p className="mt-2 rounded-xl bg-gray-50 p-3 text-sm text-gray-700">{e.message}</p>}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <a href={whatsAppLink(e.phone, msg)} target="_blank" rel="noopener noreferrer" className="btn-green">
                    <MessageCircle className="h-4 w-4" aria-hidden /> Open WhatsApp chat
                  </a>
                  <a href={telLink(e.phone)} className="btn-outline"><Phone className="h-4 w-4" aria-hidden /> Call</a>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
                  <span className="text-sm font-semibold text-gray-600">Mark as:</span>
                  {(["new", "contacted", "joined"] as const).filter((s) => s !== e.status).map((s) => (
                    <form key={s} action={setStatus}>
                      <input type="hidden" name="id" value={e.id} />
                      <input type="hidden" name="status" value={s} />
                      <SubmitButton className="btn !min-h-9 !px-4 !py-1.5 border border-brand-navy text-brand-navy hover:bg-brand-navy-soft" pendingText="…">
                        {s === "new" ? "New" : s === "contacted" ? "Contacted" : "Joined"}
                      </SubmitButton>
                    </form>
                  ))}
                  <form action={deleteEnquiry} className="ml-auto">
                    <input type="hidden" name="id" value={e.id} />
                    <ConfirmButton message={`Delete the enquiry from ${e.parent_name}? This cannot be undone.`} className="btn !min-h-9 !px-3 !py-1.5 text-red-600 hover:bg-red-50" aria-label={`Delete enquiry from ${e.parent_name}`}>
                      <Trash2 className="h-4 w-4" aria-hidden /> Delete
                    </ConfirmButton>
                  </form>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </>
  );
}
