import { Analytics } from "@vercel/analytics/next";
import { Announcements } from "@/components/Announcements";
import { EnquiryProvider } from "@/components/EnquiryProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TopBar } from "@/components/TopBar";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { getSiteData } from "@/lib/data";

// Public pages are cached and refreshed at most once a minute.
export const revalidate = 60;

/** Frame shared by every public page: announcements, header, footer, WhatsApp button. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteData();
  return (
    <EnquiryProvider branches={site.branches.map((b) => b.name)}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[70] focus:rounded focus:bg-white focus:p-3">
        Skip to content
      </a>
      <Announcements items={site.announcements} />
      <TopBar branches={site.branches} />
      <Header />
      <main id="main">{children}</main>
      <Footer branches={site.branches} social={site.social} />
      <WhatsAppFab options={site.branches.map((b) => ({ name: b.name, whatsapp: b.whatsapp }))} />
      {/* Cookie-free visitor statistics; shows data once "Web Analytics" is enabled in the Vercel dashboard. */}
      <Analytics />
    </EnquiryProvider>
  );
}
