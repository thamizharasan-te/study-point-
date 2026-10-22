import { MessageCircle, Phone } from "lucide-react";
import type { Branch } from "@/lib/types";
import { telLink, whatsAppLink } from "@/lib/utils";

/** Slim contact strip above the header (desktop only; phones use the floating WhatsApp button). */
export function TopBar({ branches }: { branches: Branch[] }) {
  const phones = Array.from(new Set(branches.flatMap((b) => b.phones)));
  const wa = branches.find((b) => b.whatsapp)?.whatsapp;
  return (
    <section aria-label="Quick contact" className="hidden bg-brand-green-dark text-white md:block">
      <div className="container-page flex items-center justify-between py-1.5 text-sm">
        <p className="font-semibold">Nursery &amp; English Classes · {branches.map((b) => b.name).join(" · ")}</p>
        <p className="flex items-center gap-5">
          <span className="flex items-center gap-1.5">
            <Phone className="h-4 w-4" aria-hidden />
            {phones.map((p, i) => (<span key={p}>{i > 0 && " / "}<a href={telLink(p)} className="hover:underline">{p}</a></span>))}
          </span>
          {wa && (
            <a href={whatsAppLink(wa, "Hello Study Point, I would like to know more.")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:underline">
              <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp us
            </a>
          )}
        </p>
      </div>
    </section>
  );
}
