import Link from "next/link";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { fmt, getDict, localePath, type Lang } from "@/lib/i18n";
import type { Branch, Social } from "@/lib/types";
import { telLink, whatsAppLink } from "@/lib/utils";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";

export function Footer({ branches, social, lang, logo }: { branches: Branch[]; social: Social; lang: Lang; logo?: { icon?: string; full?: string } }) {
  const t = getDict(lang);
  return (
    <footer className="relative bg-brand-navy-dark pb-[env(safe-area-inset-bottom)] text-white">
      {/* Green wave along the top edge */}
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-5 w-full -translate-y-full sm:h-8" aria-hidden="true">
        <path d="M0 40V22C240-6 520 0 760 16S1200 34 1440 6V40Z" className="fill-brand-navy-dark" />
        <path d="M0 22C240-6 520 0 760 16S1200 34 1440 6" fill="none" className="stroke-brand-green" strokeWidth="5" />
      </svg>
      <div className="container-page grid items-start gap-x-10 gap-y-9 pb-8 pt-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:pt-12">
        <div className="space-y-4 lg:col-span-4 lg:pr-4">
          <Logo light icon={logo?.icon} full={logo?.full} href={localePath(lang, "/")} tagline={t.brand.tagline} />
          <p className="max-w-xs text-sm text-white/80">{t.footer.about}</p>
          {branches[0]?.phones[0] && (
            <a href={telLink(branches[0].phones[0])} className="flex items-center gap-2 text-xl font-bold hover:underline">
              <MessageCircle className="h-6 w-6 text-[#25d366]" aria-hidden />{branches[0].phones[0]}
            </a>
          )}
          <SocialLinks social={social} tone="color" lang={lang} />
        </div>

        <nav aria-label={t.footer.aria} className="lg:col-span-3">
          <h2 className="text-lg font-bold leading-tight">{t.footer.quickLinks}</h2>
          <span className="mt-1.5 block h-1 w-8 rounded-full bg-brand-green" aria-hidden />
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm lg:grid-cols-1">
            {t.nav.items.map((n) => (
              <li key={n.href}><Link href={localePath(lang, n.href)} className="text-white/80 hover:text-white hover:underline">{n.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="sm:col-span-2 lg:col-span-5">
          <h2 className="text-lg font-bold leading-tight">{t.footer.branches}</h2>
          <span className="mt-1.5 block h-1 w-8 rounded-full bg-brand-green" aria-hidden />
          <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-1 min-[1280px]:grid-cols-2">
            {branches.map((b) => (
              <li key={b.id} className="space-y-1.5 text-sm text-white/85">
                <p className="font-bold text-white">{b.display_name ?? b.name}</p>
                <p className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{b.address}</p>
                {b.hours && <p className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{b.hours}</p>}
                <p className="flex gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span className="flex flex-col">
                    {b.phones.map((p) => <a key={p} href={telLink(p)} className="hover:underline">{p}</a>)}
                  </span>
                </p>
                {b.whatsapp && (
                  <a
                    href={whatsAppLink(b.whatsapp, t.whatsapp.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t.branch.whatsapp} — ${fmt(t.whatsapp.chatWith, { name: b.display_name ?? b.name })}`}
                    className="mt-1 inline-flex items-center gap-2 rounded-full bg-brand-green px-4 py-2 text-sm font-bold text-white hover:bg-brand-green-dark"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    {t.branch.whatsapp}
                  </a>
                )}
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
