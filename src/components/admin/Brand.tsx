import { SmartImage } from "../SmartImage";
import type { SiteImages } from "@/lib/types";

/** The logo to show in the admin: the one uploaded in Main Pictures, else Study Point's own logo. */
export function AdminLogo({ images, className = "h-10" }: { images?: Pick<SiteImages, "logo" | "logoFull">; className?: string }) {
  const own = !images?.logoFull && !images?.logo;
  const src = images?.logoFull || images?.logo || "/logo.png";
  return (
    <SmartImage
      src={src}
      alt="Study Point"
      width={own ? 540 : images?.logoFull ? 480 : 160}
      height={own ? 380 : images?.logoFull ? 160 : 160}
      priority
      className={`${className} w-auto max-w-[12rem] object-contain`}
    />
  );
}
