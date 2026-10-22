import type { Metadata } from "next";

// The admin area must never appear in Google.
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Study Point Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
