/** Decorative shapes (hidden from screen readers). */

export function LeafSprig({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 120 220" className={className} aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M60 215C58 150 62 90 78 10" className="stroke-brand-green" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".5" />
      {[
        [64, 170, -40, 0.55], [60, 135, 40, 0.35], [68, 100, -40, 0.7], [72, 66, 40, 0.35], [76, 34, -35, 0.55],
      ].map(([x, y, r, c], i) => (
        <path key={i} transform={`translate(${x} ${y}) rotate(${r})`} d="M0 0C14-26 44-26 54 0C44 24 14 24 0 0Z" className="fill-brand-green" opacity={c as number} />
      ))}
    </svg>
  );
}

/** Soft curved divider placed at the bottom of a coloured section. */
export function Wave({ className = "", fill }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className={`block h-8 w-full sm:h-14 ${className}`} aria-hidden="true">
      <path d="M0 40C240 90 480 90 720 50S1200-10 1440 40V80H0Z" fill={fill} className={fill ? undefined : "fill-brand-cream"} />
    </svg>
  );
}

/* ---- Playful shapes for the home page (all decorative) ---- */
type D = { className?: string; style?: React.CSSProperties };

export function Sun({ className = "", style }: D) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x="47" y="2" width="6" height="16" rx="3" fill="#ffb300" transform={`rotate(${i * 30} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="24" fill="#ffd54f" />
      <circle cx="42" cy="46" r="3" fill="#7a4a00" /><circle cx="58" cy="46" r="3" fill="#7a4a00" />
      <path d="M41 56Q50 65 59 56" stroke="#7a4a00" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Cloud({ className = "", style }: D) {
  return (
    <svg viewBox="0 0 120 70" className={className} style={style} aria-hidden="true">
      <path d="M25 60a20 20 0 0 1 2-40 26 26 0 0 1 50-6 22 22 0 0 1 20 46Z" fill="#fff" stroke="#cfe9fb" strokeWidth="3" />
    </svg>
  );
}

export function Star({ className = "", style, color = "#ffc83d" }: D & { color?: string }) {
  return (
    <svg viewBox="0 0 50 50" className={className} style={style} aria-hidden="true">
      <path d="M25 3l6.5 15 16 1.5-12 10.5 3.7 16L25 37.5 10.8 46l3.7-16L2.5 19.5l16-1.5Z" fill={color} stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function Balloon({ className = "", style, color = "#ff6f91" }: D & { color?: string }) {
  return (
    <svg viewBox="0 0 50 90" className={className} style={style} aria-hidden="true">
      <path d="M25 4C10 4 5 18 8 30c3 12 12 20 17 22 5-2 14-10 17-22C45 18 40 4 25 4Z" fill={color} />
      <path d="M25 52l-4 7h8Z" fill={color} />
      <path d="M25 59c-5 8 5 14 0 28" stroke="#9aa5b1" strokeWidth="2" fill="none" />
      <ellipse cx="17" cy="19" rx="4" ry="7" fill="#fff" opacity=".45" transform="rotate(20 17 19)" />
    </svg>
  );
}

export function Heart({ className = "", style, color = "#ff6f91" }: D & { color?: string }) {
  return (
    <svg viewBox="0 0 50 46" className={className} style={style} aria-hidden="true">
      <path d="M25 44C8 31 2 22 2 14 2 7 7 2 14 2c5 0 9 3 11 7 2-4 6-7 11-7 7 0 12 5 12 12 0 8-6 17-23 30Z" fill={color} />
    </svg>
  );
}

export function Pencil({ className = "", style }: D) {
  return (
    <svg viewBox="0 0 120 30" className={className} style={style} aria-hidden="true">
      <rect x="0" y="5" width="22" height="20" rx="4" fill="#ff6f91" />
      <rect x="22" y="5" width="70" height="20" fill="#ffc83d" />
      <rect x="22" y="13" width="70" height="4" fill="#f5a300" />
      <path d="M92 5l22 10-22 10Z" fill="#f6d9b0" />
      <path d="M108 11l6 4-6 4Z" fill="#374151" />
    </svg>
  );
}

export function AbcBlock({ className = "", style, letter = "A", color = "#4fc3f7" }: D & { letter?: string; color?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} style={style} aria-hidden="true">
      <rect x="4" y="4" width="52" height="52" rx="10" fill={color} />
      <rect x="4" y="4" width="52" height="52" rx="10" fill="none" stroke="#fff" strokeWidth="3" opacity=".6" />
      <text x="30" y="43" textAnchor="middle" fontSize="34" fontWeight="800" fill="#fff" fontFamily="sans-serif">{letter}</text>
    </svg>
  );
}

/** A row of little shapes used as a section divider. */
export function Confetti({ className = "" }: { className?: string }) {
  const dots = ["#ff6f91", "#ffc83d", "#6fcf7a", "#4fc3f7", "#b07cf7"];
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`} aria-hidden="true">
      {dots.concat(dots.slice().reverse()).map((c, i) => <span key={i} className="block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c, transform: `translateY(${i % 2 ? 3 : -3}px)` }} />)}
    </div>
  );
}

/** Curved edge for a coloured band (put it at the top of the band; `fill` is the colour of the section above). */
export function WaveTop({ className = "", fillClass = "fill-brand-cream" }: { className?: string; fillClass?: string }) {
  return (
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className={`block h-5 w-full sm:h-9 ${className}`} aria-hidden="true">
      <path d="M0 0H1440V20C1200 70 960 -10 720 25S240 65 0 20Z" className={fillClass} />
    </svg>
  );
}
