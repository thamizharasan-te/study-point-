import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import type { Branch, Social } from "@/lib/types";
import { NAV } from "@/lib/nav";
import { telLink } from "@/lib/utils";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";

export function Footer({ branches, social }: { branches: Branch[]; social: Social }) {
  return (
    <footer className="bg-brand-navy-dark text-white">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.6fr]">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-xs text-sm text-white/80">
            A nurturing nursery and English tuition centre in Point Pedro and Vathiry, Sri Lanka.
          </p>
          <SocialLinks social={social} />
        </div>

        <nav aria-label="Footer">
          <h2 className="text-lg font-bold">Quick links</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.href}><Link href={n.href} className="text-white/80 hover:text-white hover:underline">{n.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="sm:col-span-2 lg:col-span-1">
          <h2 className="text-lg font-bold">Our branches</h2>
          <ul className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {branches.map((b) => (
              <li key={b.id} className="space-y-1.5 text-sm text-white/85">
                <p className="font-bold text-white">{b.name}</p>
                <p className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{b.address}</p>
                {b.hours && <p className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{b.hours}</p>}
                <p className="flex flex-wrap gap-x-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {b.phones.map((p) => <a key={p} href={telLink(p)} className="hover:underline">{p}</a>)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Study Point. All rights reserved.
      </p>
    </footer>
  );
}
