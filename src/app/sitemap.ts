import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/about", "/nursery", "/classes", "/gallery", "/contact"];
  return paths.map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: new Date(),
    changeFrequency: p === "" || p === "/gallery" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.7,
  }));
}
