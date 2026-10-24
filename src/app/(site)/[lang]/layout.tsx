import { Analytics } from "@vercel/analytics/next";
import { notFound } from "next/navigation";
import { Announcements } from "@/components/Announcements";
import { EnquiryProvider } from "@/components/EnquiryProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LangProvider } from "@/components/LangProvider";
import { PageViewTracker } from "@/components/PageViewTracker";
import { TopBar } from "@/components/TopBar";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { getSiteData } from "@/lib/data";
import { getDict, isLang, LANGS } from "@/lib/i18n";
import { localize } from "@/lib/i18n/localize";

// Public pages are cached and refreshed at most once a minute.
export const revalidate = 60;
// Only /en (shown without a prefix) and /ta exist.
export const dynamicParams = false;
export const generateStaticParams = () => LANGS.map((lang) => ({ lang }));

/** Frame shared by every public page: announcements, header, footer, WhatsApp button. */
export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const dict = getDict(lang);
  const raw = await getSiteData();
  const site = localize(raw, lang);
  // Form option values stay English (what the admin sees); labels follow the language.
  const branchOptions = raw.branches.map((b, i) => ({ value: b.name, label: site.branches[i].display_name ?? b.name }));

  return (
    <div lang={lang}>
      <LangProvider lang={lang} dict={dict}>
        <EnquiryProvider branches={branchOptions}>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[70] focus:rounded focus:bg-white focus:p-3">
            {dict.nav.skip}
          </a>
          <Announcements items={site.announcements} label={dict.announcements.aria} />
          <TopBar branches={site.branches} lang={lang} />
          <Header />
          <main id="main">{children}</main>
          <Footer branches={site.branches} social={site.social} lang={lang} />
          <WhatsAppFab options={site.branches.map((b) => ({ name: b.display_name ?? b.name, whatsapp: b.whatsapp }))} />
          {/* Cookie-free visitor statistics; shows data once "Web Analytics" is enabled in the Vercel dashboard. */}
          <Analytics />
          <PageViewTracker />
        </EnquiryProvider>
      </LangProvider>
    </div>
  );
}
