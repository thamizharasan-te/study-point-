import type { Metadata, Viewport } from "next";
import { Kaushan_Script, Noto_Sans_Tamil, Nunito, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/utils";

const display = Playfair_Display({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display", display: "swap" });
const body = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-body", display: "swap" });
// Tamil helper lines in the admin area use this font.
const tamil = Noto_Sans_Tamil({ subsets: ["tamil"], weight: ["400", "600"], variable: "--font-tamil", display: "swap" });
const script = Kaushan_Script({ subsets: ["latin"], weight: "400", variable: "--font-script", display: "swap" });

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

export const viewport: Viewport = { themeColor: "#2e7d32", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${script.variable} ${tamil.variable}`}>
      <body>{children}</body>
    </html>
  );
}
