"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { whatsAppLink } from "@/lib/utils";

/**
 * Floating WhatsApp button on every page. With one number it links straight
 * to WhatsApp; with several branches it lets the visitor pick one.
 */
export function WhatsAppFab({ options }: { options: { name: string; whatsapp: string }[] }) {
  const [open, setOpen] = useState(false);
  const list = options.filter((o) => o.whatsapp);
  if (!list.length) return null;
  const msg = "Hello Study Point, I would like to know more.";

  const circle =
    "flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition-transform hover:scale-105";

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {open && list.length > 1 && (
        <ul className="w-56 rounded-2xl bg-white p-2 shadow-card" aria-label="Choose a branch to chat with">
          {list.map((o) => (
            <li key={o.name}>
              <a
                href={whatsAppLink(o.whatsapp, msg)}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl px-3 py-2.5 text-sm font-bold text-brand-navy hover:bg-brand-green-soft"
              >
                Chat with {o.name}
              </a>
            </li>
          ))}
        </ul>
      )}
      {list.length === 1 ? (
        <a href={whatsAppLink(list[0].whatsapp, msg)} target="_blank" rel="noopener noreferrer" className={circle} aria-label="Chat with us on WhatsApp">
          <MessageCircle className="h-7 w-7" aria-hidden />
        </a>
      ) : (
        <button
          type="button"
          className={circle}
          aria-label={open ? "Close WhatsApp options" : "Chat with us on WhatsApp"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-7 w-7" aria-hidden /> : <MessageCircle className="h-7 w-7" aria-hidden />}
        </button>
      )}
    </div>
  );
}
