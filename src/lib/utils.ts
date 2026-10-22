/** Keep only digits of a phone number. */
export const digits = (s: string) => s.replace(/\D/g, "");

/**
 * Turn a Sri Lankan number (0767666826, +94 76 766 6826 …) into the
 * international digits WhatsApp's wa.me links expect (94767666826).
 */
export function toWhatsAppNumber(phone: string): string {
  const d = digits(phone);
  if (d.startsWith("94")) return d;
  if (d.startsWith("0")) return "94" + d.slice(1);
  return d;
}

export function whatsAppLink(phone: string, text?: string): string {
  const base = `https://wa.me/${toWhatsAppNumber(phone)}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** tel: link that works on phones. */
export const telLink = (phone: string) => `tel:${digits(phone)}`;

export const SITE_NAME = "Study Point";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
