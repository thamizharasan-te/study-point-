// Generates the temporary placeholder illustrations in /public/placeholders.
// Real photos are uploaded later from the admin page (Gallery), so these are
// intentionally simple, clearly-labelled stand-ins.
// Run: node scripts/make-placeholders.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const OUT = new URL("../public/placeholders/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const C = { green: "#2e7d32", pink: "#e61e63", navy: "#14306b", sun: "#ffc83d", sky: "#cfe3ff", cream: "#fff4e0" };

/** A simple child figure: head, hair, body. */
const kid = (x, y, s, shirt, hair) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-55" y="60" width="110" height="130" rx="40" fill="${shirt}"/>
    <circle cx="0" cy="0" r="58" fill="#f2b88f"/>
    <path d="M-60 -5 C-62 -70 62 -70 60 -5 C40 -40 -40 -40 -60 -5Z" fill="${hair}"/>
    <circle cx="-20" cy="5" r="6" fill="#3b2a20"/><circle cx="20" cy="5" r="6" fill="#3b2a20"/>
    <path d="M-18 28 Q0 46 18 28" stroke="#b5473a" stroke-width="6" fill="none" stroke-linecap="round"/>
  </g>`;

const scenes = {
  kids: (w, h) => `${kid(w * 0.36, h * 0.48, w / 1100, C.green, "#2b1a12")}${kid(w * 0.64, h * 0.5, w / 1100, C.navy, "#4a2c17")}
    <rect x="${w * 0.22}" y="${h * 0.8}" width="${w * 0.56}" height="${h * 0.08}" rx="14" fill="#fff" opacity=".9"/>`,
  blocks: (w, h) => `
    <rect x="${w * 0.3}" y="${h * 0.6}" width="${w * 0.14}" height="${w * 0.14}" fill="${C.pink}" rx="8"/>
    <rect x="${w * 0.46}" y="${h * 0.6}" width="${w * 0.14}" height="${w * 0.14}" fill="${C.navy}" rx="8"/>
    <rect x="${w * 0.38}" y="${h * 0.6 - w * 0.14}" width="${w * 0.14}" height="${w * 0.14}" fill="${C.sun}" rx="8"/>
    ${kid(w * 0.74, h * 0.45, w / 1300, C.pink, "#2b1a12")}`,
  book: (w, h) => `${kid(w * 0.5, h * 0.42, w / 1100, C.navy, "#2b1a12")}
    <path d="M${w * 0.28} ${h * 0.8} L${w * 0.5} ${h * 0.74} L${w * 0.72} ${h * 0.8} L${w * 0.72} ${h * 0.9} L${w * 0.5} ${h * 0.84} L${w * 0.28} ${h * 0.9}Z" fill="#fff"/>`,
  paint: (w, h) => `
    ${[0, 1, 2, 3, 4].map((i) => `<circle cx="${w * (0.2 + i * 0.15)}" cy="${h * (0.35 + (i % 2) * 0.2)}" r="${w * 0.06}" fill="${[C.pink, C.sun, C.green, C.navy, "#ff8a3d"][i]}" opacity=".85"/>`).join("")}
    ${kid(w * 0.5, h * 0.6, w / 1500, C.green, "#2b1a12")}`,
  play: (w, h) => `
    <path d="M${w * 0.1} ${h * 0.9} L${w * 0.35} ${h * 0.3} L${w * 0.6} ${h * 0.9}Z" fill="${C.sun}"/>
    <circle cx="${w * 0.75}" cy="${h * 0.3}" r="${w * 0.1}" fill="${C.sun}" opacity=".7"/>
    ${kid(w * 0.62, h * 0.62, w / 1500, C.pink, "#4a2c17")}`,
};

function svg(name, w, h, bgA, bgB, scene, label) {
  const body = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bgA}"/><stop offset="1" stop-color="${bgB}"/></linearGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <circle cx="${w * 0.12}" cy="${h * 0.18}" r="${w * 0.05}" fill="#fff" opacity=".5"/>
  <circle cx="${w * 0.9}" cy="${h * 0.75}" r="${w * 0.08}" fill="#fff" opacity=".35"/>
  ${scenes[scene](w, h)}
  <text x="${w / 2}" y="${h - 14}" text-anchor="middle" font-family="sans-serif" font-size="${Math.max(12, w / 60)}" fill="#14306b" opacity=".55">Placeholder photo</text>
</svg>`;
  writeFileSync(new URL(name, OUT), body);
}

svg("hero.svg", 1100, 800, "#d8ecd2", "#ffe3ec", "kids", "Two children learning together (placeholder)");
svg("nursery.svg", 800, 700, "#ffe3ec", "#fff3d6", "blocks", "Child playing with blocks (placeholder)");
svg("classes.svg", 800, 700, "#dbe8ff", "#eaf3ff", "book", "Student reading (placeholder)");
svg("why.svg", 800, 700, "#e8f3e4", "#fff0d9", "book", "Children reading together (placeholder)");
svg("about.svg", 1000, 760, "#e8f3e4", "#e7eefb", "kids", "Study Point students (placeholder)");

const g = [
  ["#d8ecd2", "#fff3d6", "book"], ["#ffe3ec", "#e7eefb", "kids"], ["#fff3d6", "#ffe3ec", "paint"], ["#dbe8ff", "#e8f3e4", "kids"],
  ["#e8f3e4", "#cfe3ff", "play"], ["#ffe3ec", "#fff3d6", "blocks"], ["#dbe8ff", "#ffe3ec", "paint"], ["#fff3d6", "#d8ecd2", "play"],
];
g.forEach(([a, b, s], i) => svg(`gallery-${i + 1}.svg`, 800, 600, a, b, s, `Gallery photo ${i + 1} (placeholder)`));
console.log("placeholders written");
