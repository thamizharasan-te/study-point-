import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import type { Branch } from "@/lib/types";
import { telLink } from "@/lib/utils";
import { Logo } from "./Logo";
import { NAV } from "@/lib/nav";

export function Footer({ branches }: { branches: Branch[] }) {
  const phones = Array.from(new Set(branches.flatMap((b) => b.phones)));
  return (
    <footer className="bg-brand-navy-dark text-white">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-3 max-w-xs text-sm text-white/80">
            A nurturing nursery and English tuition centre in Point Pedro and Vathiry, Sri Lanka.
          </p>
        </div>
        <nav aria-label="Footer">
          <h2 className="text-lg font-bold">Quick links</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {NAV.map((n) => (
              <li key={n.href}><Link href={n.href} className="text-white/80 hover:text-white">{n.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-lg font-bold">Contact</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              <span>
                {phones.map((p, i) => (
                  <span key={p}>{i > 0 && " / "}<a href={telLink(p)} className="hover:underline">{p}</a></span>
                ))}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden /> {branches.map((b) => b.name).join("  |  ")}
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Study Point. All rights reserved.
      </p>
    </footer>
  );
}
