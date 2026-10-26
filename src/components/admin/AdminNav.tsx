"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const ITEMS = [
  { href: "/admin", label: "Home" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/visitors", label: "Visitors" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/images", label: "Main Pictures" },
  { href: "/admin/testimonials", label: "Parent Comments" },
  { href: "/admin/stats", label: "Numbers" },
  { href: "/admin/branches", label: "Branches" },
  { href: "/admin/content", label: "Website Text" },
  { href: "/admin/theme", label: "Theme" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/password", label: "Password" },
];

/** Scrollable tab bar on phones, so every section is one tap away. */
export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin sections" className="overflow-x-auto border-b bg-white">
      <ul className="container-page flex gap-1 py-2">
        {ITEMS.map((i) => {
          const active = i.href === "/admin" ? pathname === "/admin" : pathname.startsWith(i.href);
          return (
            <li key={i.href} className="shrink-0">
              <Link
                href={i.href}
                aria-current={active ? "page" : undefined}
                className={clsx("block rounded-full px-4 py-2 text-sm font-bold", active ? "bg-brand-navy text-white" : "text-brand-navy hover:bg-brand-navy-soft")}
              >
                {i.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
