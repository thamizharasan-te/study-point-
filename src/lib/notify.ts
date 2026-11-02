import "server-only";
import { SITE_URL } from "./utils";

/**
 * Emails the owner when a new enquiry / application arrives (via Resend).
 * Needs RESEND_API_KEY and NOTIFY_EMAIL (one or more addresses, comma separated) in the host's environment;
 * without them nothing is sent. NOTIFY_FROM is optional (defaults to Resend's test sender).
 * It never throws and is never awaited by the visitor's request path: the enquiry is already saved.
 */
export async function notifyOwner(subject: string, lines: [label: string, value: string | null | undefined][], adminPath: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = (process.env.NOTIFY_EMAIL ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!key || to.length === 0) return;

  const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").slice(0, 150);
  const text = [
    ...lines.filter(([, v]) => v && v.trim()).map(([k, v]) => `${k}: ${v}`),
    "",
    `Open in admin: ${SITE_URL}${adminPath}`,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM || "Study Point <onboarding@resend.dev>",
        to,
        subject: oneLine(subject),
        text,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("notify email failed", res.status, (await res.text()).slice(0, 200));
  } catch (e) {
    console.error("notify email failed", e instanceof Error ? e.message : e);
  }
}
