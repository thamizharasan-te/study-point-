/** Decorative shapes (hidden from screen readers). */

export function LeafSprig({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 120 220" className={className} aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M60 215C58 150 62 90 78 10" stroke="#2e7d32" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".5" />
      {[
        [64, 170, -40, "#81c784"], [60, 135, 40, "#a5d6a7"], [68, 100, -40, "#66bb6a"], [72, 66, 40, "#a5d6a7"], [76, 34, -35, "#81c784"],
      ].map(([x, y, r, c], i) => (
        <path key={i} transform={`translate(${x} ${y}) rotate(${r})`} d="M0 0C14-26 44-26 54 0C44 24 14 24 0 0Z" fill={c as string} opacity=".75" />
      ))}
    </svg>
  );
}

/** Soft curved divider placed at the bottom of a coloured section. */
export function Wave({ className = "", fill = "#fffaf3" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className={`block h-8 w-full sm:h-14 ${className}`} aria-hidden="true">
      <path d="M0 40C240 90 480 90 720 50S1200-10 1440 40V80H0Z" fill={fill} />
    </svg>
  );
}
