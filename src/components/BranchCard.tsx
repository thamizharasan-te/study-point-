import { Clock, ExternalLink, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Branch } from "@/lib/types";
import { telLink, whatsAppLink } from "@/lib/utils";
import { SampleTag } from "./SampleTag";

/**
 * Embedded map source. If the admin pasted a Google "Embed a map" link we use
 * it as-is; otherwise we embed a search for the branch address, which needs no API key.
 */
function mapEmbedSrc(b: Branch) {
  if (/google\.[a-z.]+\/maps\/embed/.test(b.map_url)) return b.map_url;
  return `https://maps.google.com/maps?q=${encodeURIComponent(`Study Point ${b.name} Sri Lanka`)}&output=embed`;
}

export function BranchCard({ branch: b }: { branch: Branch }) {
  const linkToMap = b.map_url && /^https?:\/\//.test(b.map_url) ? b.map_url : `https://maps.google.com/?q=${encodeURIComponent(`Study Point ${b.name} Sri Lanka`)}`;
  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-card">
      <div className="space-y-3 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-extrabold text-brand-navy">{b.name}</h2>
          {b.is_placeholder && <SampleTag label="Details to be confirmed" />}
        </div>
        <p className="flex gap-2 text-gray-700"><MapPin className="mt-1 h-5 w-5 shrink-0 text-brand-pink" aria-hidden />{b.address}</p>
        {b.hours && <p className="flex gap-2 text-gray-700"><Clock className="mt-1 h-5 w-5 shrink-0 text-brand-green" aria-hidden />{b.hours}</p>}
        <p className="flex flex-wrap gap-x-3 gap-y-1 text-gray-700">
          <Phone className="mt-1 h-5 w-5 shrink-0 text-brand-navy" aria-hidden />
          {b.phones.map((p) => <a key={p} href={telLink(p)} className="font-semibold text-brand-navy underline-offset-2 hover:underline">{p}</a>)}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {b.whatsapp && (
            <a href={whatsAppLink(b.whatsapp, "Hello Study Point, I would like to know more.")} target="_blank" rel="noopener noreferrer" className="btn-green">
              <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
            </a>
          )}
          <a href={linkToMap} target="_blank" rel="noopener noreferrer" className="btn-outline">
            <ExternalLink className="h-4 w-4" aria-hidden /> Open in Maps
          </a>
        </div>
      </div>
      <iframe
        title={`Map showing the ${b.name} branch`}
        src={mapEmbedSrc(b)}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-64 w-full border-0"
      />
    </article>
  );
}
