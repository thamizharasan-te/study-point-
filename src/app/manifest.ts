import type { MetadataRoute } from "next";

/** Lets phones show the site's name and icon when it is added to the home screen. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Study Point — Kindergarten & English Classes",
    short_name: "Study Point",
    description: "Kindergarten (ages 3–5) and English classes in Point Pedro and Vathiry, Sri Lanka.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#14306b",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
