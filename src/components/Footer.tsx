import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { fmt, getDict, localePath, type Lang } from "@/lib/i18n";
import type { Branch, Social } from "@/lib/types";
import { telLink } from "@/lib/utils";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";

export function Footer({ branches, social, lang }: { branches: Branch[]; social: Social; lang: Lang }) {
  const t = getDict(lang);
  return (
    <footer className="bg-brand-navy-dark text-white">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.6fr]">
        <div className="space-y-4">
          <Logo light href={localePath(lang, "/")} tagline={t.brand.tagline} />
          <p className="max-w-xs text-sm text-white/80">{t.footer.about}</p>
          <SocialLinks social={social} />
        </div>

        <nav aria-label={t.footer.aria}>
          <h2 className="text-lg font-bold">{t.footer.quickLinks}</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {t.nav.items.map((n) => (
              <li key={n.href}><Link href={localePath(lang, n.href)} className="text-white/80 hover:text-white hover:underline">{n.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="sm:col-span-2 lg:col-span-1">
          <h2 className="text-lg font-bold">{t.footer.branches}</h2>
          <ul className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {branches.map((b) => (
              <li key={b.id} className="space-y-1.5 text-sm text-white/85">
                <p className="font-bold text-white">{b.display_name ?? b.name}</p>
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
        {fmt(t.footer.rights, { year: new Date().getFullYear() })}
      </p>
    </footer>
  );
}
