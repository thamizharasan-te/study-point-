import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { LogoMark } from "@/components/Logo";
import { requireAdmin } from "@/lib/admin";
import { signOut } from "./actions";

export const dynamic = "force-dynamic"; // always fresh, never cached

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { email } = await requireAdmin();
  return (
    <>
      <header className="bg-brand-navy text-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-2">
            <LogoMark className="h-9 w-9" />
            <div className="leading-tight">
              <p className="font-bold">Study Point Admin</p>
              <p className="max-w-[14rem] truncate text-xs text-white/70">{email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Link href="/" target="_blank" className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-2 hover:bg-white/20">
              View website <ExternalLink className="h-4 w-4" aria-hidden />
            </Link>
            <form action={signOut}>
              <button type="submit" className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-2 hover:bg-white/20">
                <LogOut className="h-4 w-4" aria-hidden /> Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <AdminNav />
      <div className="container-page py-6">{children}</div>
    </>
  );
}
