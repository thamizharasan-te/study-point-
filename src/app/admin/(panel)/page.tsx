import Link from "next/link";
import { Eye, Inbox, Image as ImageIcon, MapPin, Megaphone, MessageSquareQuote, ChartColumn, FileText, Palette } from "lucide-react";
import { AdminHeading, Card } from "@/components/admin/Layout";
import { requireAdmin } from "@/lib/admin";

const TILES = [
  { href: "/admin/enquiries", icon: Inbox, title: "Enquiries", text: "See who has contacted you" },
  { href: "/admin/visitors", icon: Eye, title: "Visitors", text: "How many people visit the website" },
  { href: "/admin/gallery", icon: ImageIcon, title: "Gallery", text: "Add or remove photos" },
  { href: "/admin/images", icon: ImageIcon, title: "Main Pictures", text: "Replace the big pictures on the pages" },
  { href: "/admin/testimonials", icon: MessageSquareQuote, title: "Parent Comments", text: "Add, edit, show or hide" },
  { href: "/admin/stats", icon: ChartColumn, title: "Numbers", text: "Students, years, branches…" },
  { href: "/admin/branches", icon: MapPin, title: "Branches", text: "Address, phone, hours, map" },
  { href: "/admin/content", icon: FileText, title: "Website Text", text: "Home heading and course lists" },
  { href: "/admin/theme", icon: Palette, title: "Theme", text: "Change all the website colours" },
  { href: "/admin/announcements", icon: Megaphone, title: "Announcements", text: "Short notices on the home page" },
];

export default async function AdminHome() {
  const { supabase } = await requireAdmin();
  const [{ count: fresh }, { count: total }] = await Promise.all([
    supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("enquiries").select("id", { count: "exact", head: true }),
  ]);

  return (
    <>
      <AdminHeading title="Welcome" tamil="என்ன செய்ய வேண்டும் என்பதைத் தேர்ந்தெடுக்கவும்" />
      <Link href="/admin/enquiries?status=new" className="mb-5 block rounded-2xl bg-brand-pink p-5 text-white shadow-md">
        <p className="text-4xl font-extrabold">{fresh ?? 0}</p>
        <p className="font-semibold">new enquiries waiting · {total ?? 0} in total</p>
      </Link>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map(({ href, icon: Icon, title, text }) => (
          <li key={href}>
            <Link href={href} className="block h-full">
              <Card className="flex h-full items-center gap-4 transition-shadow hover:shadow-md">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-green-soft text-brand-green"><Icon className="h-6 w-6" aria-hidden /></span>
                <span><span className="block text-lg font-bold text-brand-navy">{title}</span><span className="text-sm text-gray-600">{text}</span></span>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
