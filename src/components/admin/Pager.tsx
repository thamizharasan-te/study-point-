import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { pageList } from "@/lib/pages";

const base = "flex h-11 min-w-11 items-center justify-center rounded-full border-2 px-3 text-sm font-bold";

/** Page numbers for admin lists (plain links, so each page is a normal address like ?page=2). */
export function Pager({ page, total, href }: { page: number; total: number; href: (n: number) => string }) {
  if (total <= 1) return null;
  return (
    <nav aria-label="Pages" className="my-6 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={href(page - 1)} aria-label="Previous page" className={`${base} border-brand-navy/30 bg-white text-brand-navy hover:bg-brand-navy-soft`}><ChevronLeft className="h-5 w-5" aria-hidden /></Link>
      ) : (
        <span aria-hidden className={`${base} border-gray-200 text-gray-300`}><ChevronLeft className="h-5 w-5" /></span>
      )}
      {pageList(page, total).map((n, i) =>
        n === "gap" ? (
          <span key={`gap-${i}`} aria-hidden className="px-1 text-gray-500">…</span>
        ) : (
          <Link
            key={n}
            href={href(n)}
            aria-label={`Page ${n}`}
            aria-current={n === page ? "page" : undefined}
            className={`${base} ${n === page ? "border-brand-navy bg-brand-navy text-white" : "border-brand-navy/30 bg-white text-brand-navy hover:bg-brand-navy-soft"}`}
          >
            {n}
          </Link>
        ),
      )}
      {page < total ? (
        <Link href={href(page + 1)} aria-label="Next page" className={`${base} border-brand-navy/30 bg-white text-brand-navy hover:bg-brand-navy-soft`}><ChevronRight className="h-5 w-5" aria-hidden /></Link>
      ) : (
        <span aria-hidden className={`${base} border-gray-200 text-gray-300`}><ChevronRight className="h-5 w-5" /></span>
      )}
    </nav>
  );
}
