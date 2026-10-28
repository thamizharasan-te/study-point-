import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { FileText, Phone, Trash2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/BrandIcons";
import { AdminHeading, Card, Help, Notice } from "@/components/admin/Layout";
import { ApplicationPdfUploader } from "@/components/admin/ApplicationPdfUploader";
import { ConfirmButton, SubmitButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import type { Application, ApplicationStatus, SiteImages } from "@/lib/types";
import { telLink, whatsAppLink } from "@/lib/utils";
import { deleteApplication, removeApplicationPdf, saveApplicationNote, setApplicationStatus } from "./actions";

export const metadata: Metadata = { title: "Applications" };

const FILTERS: { value: "all" | ApplicationStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
];
const BADGE: Record<ApplicationStatus, string> = {
  new: "bg-brand-pink text-white",
  contacted: "bg-amber-100 text-amber-800",
  accepted: "bg-brand-green text-white",
  declined: "bg-gray-200 text-gray-700",
};
const LABEL: Record<ApplicationStatus, string> = { new: "New", contacted: "Contacted", accepted: "Accepted", declined: "Declined" };

const fileLink = (path: string | null) => (path ? `/admin/applications/file?p=${encodeURIComponent(path)}` : null);
const age = (dob: string | null) => {
  if (!dob) return "";
  const years = (Date.now() - new Date(dob).getTime()) / (365.25 * 86_400_000);
  return years >= 1 ? `${Math.floor(years)} yrs` : `${Math.max(1, Math.floor(years * 12))} months`;
};

function Row({ k, v }: { k: string; v?: string | null }) {
  if (!v) return null;
  return <div><dt className="inline font-semibold">{k}: </dt><dd className="inline">{v}</dd></div>;
}

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ status?: string; saved?: string; error?: string }> }) {
  const { status = "all", saved, error } = await searchParams;
  const { supabase } = await requireAdmin();

  let q = supabase.from("applications").select("*").order("created_at", { ascending: false }).limit(200);
  if (status !== "all") q = q.eq("status", status);
  const [{ data, error: loadError }, { data: img }] = await Promise.all([q, supabase.from("site_content").select("value").eq("key", "images").maybeSingle()]);
  const rows = (data ?? []) as Application[];
  const pdf = (img?.value as SiteImages | undefined)?.applicationPdf;

  return (
    <>
      <AdminHeading title="Applications" tamil="பிள்ளைகளைச் சேர்க்கும் விண்ணப்பங்கள்" />
      <Notice saved={saved} error={error} />

      {loadError && (
        <Help>
          The applications table is not set up yet. In Supabase → SQL Editor, run <strong>supabase/schema.sql</strong>, then <strong>supabase/policies.sql</strong> and <strong>supabase/storage.sql</strong> (each is safe to re-run), then reload this page.
        </Help>
      )}

      <Card className="mb-5 space-y-3">
        <h2 className="text-lg font-bold text-brand-navy">Printable application form (PDF)</h2>
        <p className="text-sm text-gray-600">Optional. Upload your paper application form and a <em>Download printable form</em> button appears on the website’s Apply page.</p>
        {pdf && <p className="text-sm font-semibold"><a href={pdf} target="_blank" rel="noopener noreferrer" className="text-brand-navy underline"><FileText className="mr-1 inline h-4 w-4" aria-hidden />View the current PDF</a></p>}
        <div className="flex flex-wrap items-center gap-3">
          <ApplicationPdfUploader hasFile={Boolean(pdf)} />
          {pdf && (
            <form action={removeApplicationPdf}>
              <ConfirmButton message="Remove the printable form from the website?" className="btn !min-h-9 !px-3 !py-1.5 text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" aria-hidden /> Remove
              </ConfirmButton>
            </form>
          )}
        </div>
      </Card>

      <div role="group" aria-label="Filter by status" className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/admin/applications" : `/admin/applications?status=${f.value}`}
            aria-current={status === f.value ? "page" : undefined}
            className={clsx("rounded-full px-4 py-2 text-sm font-bold", status === f.value ? "bg-brand-navy text-white" : "bg-white text-brand-navy ring-1 ring-gray-200")}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {!loadError && rows.length === 0 && <Card><p className="text-gray-600">No applications here yet.</p></Card>}

      <ul className="space-y-3">
        {rows.map((a) => {
          const wa = a.whatsapp || a.phone;
          const msg = `Hello ${a.parent_name}, this is Study Point. Thank you for the application for ${a.child_name}.`;
          const docs = [
            { label: "Child’s photo", href: fileLink(a.photo_path) },
            { label: "Birth certificate", href: fileLink(a.birth_cert_path) },
            { label: "Other document", href: fileLink(a.other_doc_path) },
          ].filter((d) => d.href);
          return (
            <li key={a.id}>
              <Card className="[overflow-wrap:anywhere]">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-brand-navy">{a.child_name}</h2>
                    <p className="text-xs text-gray-500">{new Date(a.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Colombo" })}</p>
                  </div>
                  <span className={clsx("rounded-full px-3 py-1 text-xs font-bold uppercase", BADGE[a.status])}>{LABEL[a.status]}</span>
                </div>

                <div className="mt-3 grid gap-4 text-sm sm:grid-cols-2">
                  <dl className="space-y-1">
                    <h3 className="font-bold text-brand-green-dark">Child</h3>
                    <Row k="Date of birth" v={a.child_dob ? `${a.child_dob} (${age(a.child_dob)})` : null} />
                    <Row k="Gender" v={a.child_gender} />
                    <Row k="Applying for" v={a.program} />
                    <Row k="Branch" v={a.branch} />
                    <Row k="Previous school" v={a.previous_school} />
                    <Row k="Health notes" v={a.health_notes} />
                  </dl>
                  <dl className="space-y-1">
                    <h3 className="font-bold text-brand-green-dark">Parent / guardian</h3>
                    <Row k="Name" v={a.parent_name} />
                    <Row k="Relationship" v={a.relationship} />
                    <div><dt className="inline font-semibold">Phone: </dt><dd className="inline"><a href={telLink(a.phone)} className="text-brand-navy underline">{a.phone}</a></dd></div>
                    <Row k="WhatsApp" v={a.whatsapp} />
                    <Row k="Email" v={a.email} />
                    <Row k="Address" v={a.address} />
                    <Row k="Emergency contact" v={[a.emergency_name, a.emergency_phone].filter(Boolean).join(" · ")} />
                    <Row k="Heard about us" v={a.how_heard} />
                  </dl>
                </div>

                {docs.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {docs.map((d) => (
                      <a key={d.label} href={d.href!} target="_blank" rel="noopener noreferrer" className="btn-outline !min-h-9 !px-4 !py-1.5 !text-sm"><FileText className="h-4 w-4" aria-hidden /> {d.label}</a>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <a href={whatsAppLink(wa, msg)} target="_blank" rel="noopener noreferrer" className="btn-green"><WhatsAppIcon className="h-4 w-4" /> Open WhatsApp chat</a>
                  <a href={telLink(a.phone)} className="btn-outline"><Phone className="h-4 w-4" aria-hidden /> Call</a>
                </div>

                <form action={saveApplicationNote} className="mt-3 flex flex-wrap items-end gap-2">
                  <input type="hidden" name="id" value={a.id} />
                  <div className="min-w-0 flex-1">
                    <label className="label" htmlFor={`note-${a.id}`}>Office note (private)</label>
                    <input id={`note-${a.id}`} name="note" defaultValue={a.admin_note ?? ""} maxLength={1000} className="input" placeholder="e.g. Called on Monday, visiting Friday" />
                  </div>
                  <SubmitButton className="btn-outline !min-h-10" pendingText="…">Save note</SubmitButton>
                </form>

                <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
                  <span className="text-sm font-semibold text-gray-600">Mark as:</span>
                  {(["new", "contacted", "accepted", "declined"] as const).filter((s) => s !== a.status).map((s) => (
                    <form key={s} action={setApplicationStatus}>
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="status" value={s} />
                      <SubmitButton className="btn !min-h-9 !px-4 !py-1.5 border border-brand-navy text-brand-navy hover:bg-brand-navy-soft" pendingText="…">{LABEL[s]}</SubmitButton>
                    </form>
                  ))}
                  <form action={deleteApplication} className="ml-auto">
                    <input type="hidden" name="id" value={a.id} />
                    <ConfirmButton message={`Delete the application for ${a.child_name} and its documents? This cannot be undone.`} className="btn !min-h-9 !px-3 !py-1.5 text-red-600 hover:bg-red-50" aria-label={`Delete application for ${a.child_name}`}>
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
