import { Megaphone } from "lucide-react";
import type { Announcement } from "@/lib/types";

/** Short notices set in /admin → Announcements, shown at the very top. */
export function Announcements({ items }: { items: Announcement[] }) {
  if (!items.length) return null;
  return (
    <div className="bg-brand-navy text-white" role="region" aria-label="Announcements">
      <ul className="container-page space-y-1 py-2 text-center text-sm font-semibold">
        {items.map((a) => (
          <li key={a.id} className="flex items-center justify-center gap-2">
            <Megaphone className="h-4 w-4 shrink-0" aria-hidden /> <span>{a.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
