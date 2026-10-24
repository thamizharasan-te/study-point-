import type { Metadata } from "next";
import { AdminHeading, Card, Help } from "@/components/admin/Layout";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Visitors" };

interface Count { views: number; visitors: number }
interface Summary {
  today: Count; last7: Count; last30: Count;
  daily: { day: string; views: number; visitors: number }[];
  pages: { path: string; views: number }[];
  devices: { device: string; views: number }[];
  sources: { source: string; views: number }[];
}

const PAGE_NAMES: Record<string, string> = { "/": "Home", "/about": "About Us", "/nursery": "Nursery", "/classes": "Classes", "/gallery": "Gallery", "/contact": "Contact" };
/** "/ta/about" → "About Us (Tamil)"; "/about" → "About Us". */
function pageName(path: string) {
  const ta = path === "/ta" || path.startsWith("/ta/");
  const base = path.replace(/^\/(en|ta)(?=\/|$)/, "") || "/";
  const name = PAGE_NAMES[base] ?? base;
  return ta ? `${name} (Tamil)` : name;
}
const num = (n: number) => n.toLocaleString("en-US");
const dayLabel = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

function Stat({ title, c }: { title: string; c: Count }) {
  return (
    <Card>
      <p className="text-sm font-semibold text-gray-600">{title}</p>
      <p className="mt-1 text-3xl font-extrabold text-brand-navy">{num(c.visitors)}</p>
      <p className="text-sm text-gray-600">visitors · {num(c.views)} page views</p>
    </Card>
  );
}

export default async function VisitorsPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.rpc("analytics_summary");
  const s = data as Summary | null;

  if (error || !s) {
    return (
      <>
        <AdminHeading title="Visitors" tamil="தளத்தைப் பார்த்தவர்கள்" />
        <Help>
          Visitor statistics are not set up yet. In Supabase → SQL Editor, run the file <strong>supabase/analytics.sql</strong> once
          (README step 5), then reload this page.
        </Help>
      </>
    );
  }

  const max = Math.max(1, ...s.daily.map((d) => d.views));
  const totalDevices = s.devices.reduce((a, d) => a + d.views, 0) || 1;
  const empty = s.last30.views === 0;

  return (
    <>
      <AdminHeading title="Visitors" tamil="தளத்தைப் பார்த்தவர்கள்" />

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat title="Today" c={s.today} />
        <Stat title="Last 7 days" c={s.last7} />
        <Stat title="Last 30 days" c={s.last30} />
      </div>

      {empty && <Help>No visits recorded yet. Open the website in another browser and refresh this page in a minute. Your own visits while signed in to admin are not counted.</Help>}

      <Card className="mt-4">
        <h2 className="text-lg font-bold text-brand-navy">Page views, last 30 days</h2>
        <div className="mt-4 flex h-40 items-end gap-[3px]" role="img" aria-label={`Bar chart of daily page views for the last 30 days. Highest day: ${max}.`}>
          {s.daily.map((d) => (
            <div key={d.day} className="flex h-full flex-1 flex-col justify-end" title={`${dayLabel(d.day)}: ${d.views} views, ${d.visitors} visitors`}>
              <div className="w-full rounded-t bg-brand-green" style={{ height: `${Math.max(d.views ? 4 : 0, (d.views / max) * 100)}%` }} />
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-xs text-gray-500" aria-hidden>
          <span>{dayLabel(s.daily[0].day)}</span>
          <span>{dayLabel(s.daily[s.daily.length - 1].day)}</span>
        </div>
      </Card>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card>
          <h2 className="text-lg font-bold text-brand-navy">Most visited pages</h2>
          <ol className="mt-3 space-y-2 text-sm">
            {s.pages.length === 0 && <li className="text-gray-500">Nothing yet.</li>}
            {s.pages.map((p) => (
              <li key={p.path} className="flex justify-between gap-3"><span className="truncate font-semibold">{pageName(p.path)}</span><span className="text-gray-600">{num(p.views)}</span></li>
            ))}
          </ol>
        </Card>
        <Card>
          <h2 className="text-lg font-bold text-brand-navy">Phone or computer</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {s.devices.length === 0 && <li className="text-gray-500">Nothing yet.</li>}
            {s.devices.map((d) => (
              <li key={d.device} className="flex justify-between gap-3"><span className="font-semibold capitalize">{d.device === "mobile" ? "Phone" : "Computer"}</span><span className="text-gray-600">{Math.round((d.views / totalDevices) * 100)}%</span></li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="text-lg font-bold text-brand-navy">Where visitors came from</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {s.sources.length === 0 && <li className="text-gray-500">Nothing yet.</li>}
            {s.sources.map((r) => (
              <li key={r.source} className="flex justify-between gap-3"><span className="truncate font-semibold">{r.source}</span><span className="text-gray-600">{num(r.views)}</span></li>
            ))}
          </ul>
        </Card>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Counts are anonymous and exclude robots and your own admin visits. “Visitors” are counted per day, so the same person on two different days counts twice.
      </p>
    </>
  );
}
