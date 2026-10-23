"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Sends one anonymous "page viewed" ping per page (see /api/hit). Respects Do Not Track. */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (navigator.doNotTrack === "1" || navigator.webdriver) return;
    fetch("/api/hit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer: document.referrer }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
