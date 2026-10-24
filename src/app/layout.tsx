import type { Metadata, Viewport } from "next";
// Fonts are self-hosted (npm packages), so the build never depends on Google Fonts being reachable.
import "@fontsource-variable/playfair-display/wght.css";
import "@fontsource-variable/nunito/wght.css";
import "@fontsource-variable/noto-sans-tamil/wght.css";
import "@fontsource/kaushan-script/400.css";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Study Point — Nursery & English Classes in Point Pedro and Vathiry", template: "%s | Study Point" },
  description:
    "Study Point is a nursery (ages 3–5) and English tuition centre in Point Pedro and Vathiry, Sri Lanka. Phonics, spoken English, grammar, writing and exam preparation in small, caring groups.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_LK",
    title: "Study Point — Little Learners. Brighter Tomorrows.",
    description: "Nursery for ages 3–5 and English classes in Point Pedro and Vathiry, Sri Lanka.",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
