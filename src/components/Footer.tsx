import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { WhatsAppIcon } from "./BrandIcons";
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
      <div className="container-page grid items-start gap-x-10 gap-y-6 pb-5 pt-7 sm:grid-cols-2 sm:gap-y-6 sm:pb-6 sm:pt-8 lg:grid-cols-12 lg:gap-x-8">
        <div className="space-y-2.5 sm:space-y-3 lg:col-span-5 lg:pr-4">
          <Logo light icon={logo?.icon} full={logo?.full} href={localePath(lang, "/")} tagline={t.brand.tagline} />
          <p className="max-w-xs text-[13px] leading-snug text-white/80 sm:text-sm sm:leading-normal">{t.footer.about}</p>
          <SocialLinks social={social} tone="color" lang={lang} />
        </div>

        {/* On laptops the quick links move to the bottom bar (below), which saves a whole column of height. */}
        <nav aria-label={t.footer.aria} className="lg:hidden">
          <h2 className="text-lg font-bold leading-tight">{t.footer.quickLinks}</h2>
          <span className="mt-1.5 block h-1 w-8 rounded-full bg-brand-green" aria-hidden />
          <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-0 text-sm sm:mt-3 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-1.5">
            {t.nav.items.map((n) => (
              <li key={n.href}><Link href={localePath(lang, n.href)} className="inline-block py-1 text-white/80 hover:text-white hover:underline sm:py-0">{n.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="sm:col-span-2 lg:col-span-7">
          <h2 className="text-lg font-bold leading-tight">{t.footer.branches}</h2>
          <span className="mt-1.5 block h-1 w-8 rounded-full bg-brand-green" aria-hidden />
          <ul className="mt-2.5 grid gap-4 sm:mt-3 sm:grid-cols-2 sm:gap-x-6">
            {branches.map((b) => (
              <li key={b.id} className="space-y-1 text-sm text-white/85 sm:space-y-1.5">
                <p className="font-bold text-white">{b.display_name ?? b.name}</p>
                <p className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{b.address}</p>
                {b.hours && <p className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{b.hours}</p>}
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <p className="flex gap-2">
                  <Phone className="mt-1.5 h-4 w-4 shrink-0 sm:mt-0.5" aria-hidden />
                  <span className="flex flex-wrap gap-x-3">
                    {b.phones.map((p) => <a key={p} href={telLink(p)} className="inline-block py-1 hover:underline">{p}</a>)}
                  </span>
                </p>
                {b.whatsapp && (
                  <a
                    href={whatsAppLink(b.whatsapp, t.whatsapp.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t.branch.whatsapp} — ${fmt(t.whatsapp.chatWith, { name: b.display_name ?? b.name })}`}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-green px-3.5 py-1.5 text-sm font-bold text-white hover:bg-brand-green-dark sm:px-4 sm:py-1.5"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    {t.branch.whatsapp}
                  </a>
                )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center gap-2 py-3 text-xs text-white/60 sm:py-3.5 lg:flex-row lg:justify-between lg:pr-20">
          <nav aria-label={t.footer.aria} className="hidden flex-wrap gap-x-5 gap-y-1 text-sm lg:flex">
            {t.nav.items.map((n) => (
              <Link key={n.href} href={localePath(lang, n.href)} className="inline-block py-1 text-white/80 hover:text-white hover:underline">{n.label}</Link>
            ))}
          </nav>
          <p className="text-center">{fmt(t.footer.rights, { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}
