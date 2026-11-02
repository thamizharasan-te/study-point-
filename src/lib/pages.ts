/** Page numbers to show: all of them when few, otherwise the first, the last and the ones around the current page. */
export function pageList(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const keep = new Set([1, total, current - 1, current, current + 1].filter((n) => n >= 1 && n <= total));
  const out: (number | "gap")[] = [];
  let last = 0;
  for (const n of [...keep].sort((a, b) => a - b)) {
    if (n - last > 1) out.push("gap");
    out.push(n);
    last = n;
  }
  return out;
}
