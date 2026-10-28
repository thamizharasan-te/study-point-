"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Sends one anonymous "page viewed" ping per page (see /api/hit). Respects Do Not Track. */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (navigator.doNotTrack === "1" || navigator.webdriver) return;
    // Sent when the browser is idle, so it never competes with the page's own images and scripts.
    const send = () =>
      fetch("/api/hit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname, referrer: document.referrer }),
        keepalive: true,
      }).catch(() => {});
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(send, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(send, 1500);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
