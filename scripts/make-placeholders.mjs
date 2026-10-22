// Generates the temporary illustrations in /public/placeholders.
// They stand in for real photos until the client uploads some (Gallery) or
// replaces the main pictures. Run: node scripts/make-placeholders.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const OUT = new URL("../public/placeholders/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const C = { green: "#2e7d32", pink: "#d81b60", navy: "#14306b", sun: "#ffc83d", orange: "#ff8a3d", sky: "#cfe3ff", wood: "#c98f5a" };
const SKIN = ["#f2b88f", "#e5a57a", "#d9966b"];

/** A leaf used as soft decoration. */
const leaf = (x, y, s, rot, fill) =>
  `<path transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" d="M0 0C30-40 90-40 120 0C90 40 30 40 0 0Z" fill="${fill}" opacity=".55"/>`;

/** A child: round head, hair, collar shirt, arms. `style` picks the hair. */
function kid(x, y, s, { shirt, hair, skin = SKIN[0], style = "short", arms = "down" }) {
  const hairBack = style === "pigtails"
    ? `<circle cx="-70" cy="30" r="22" fill="${hair}"/><circle cx="70" cy="30" r="22" fill="${hair}"/>`
    : "";
  const hairTop = style === "pigtails"
    ? `<path d="M-62 0C-66-62 66-62 62 0C45-30-45-30-62 0Z" fill="${hair}"/>`
    : `<path d="M-60 -4C-64-70 64-70 60-4C44-36-44-36-60-4Z" fill="${hair}"/><path d="M-60 -4C-50-24-20-34 10-30C-10-14-34-10-60-4Z" fill="${hair}"/>`;
  const armPath = arms === "up"
    ? `<path d="M-48 80C-90 50-92 10-84-20" stroke="${shirt}" stroke-width="30" stroke-linecap="round" fill="none"/><circle cx="-84" cy="-24" r="16" fill="${skin}"/>`
    : `<path d="M-50 90C-78 130-60 160-30 170" stroke="${shirt}" stroke-width="30" stroke-linecap="round" fill="none"/><path d="M50 90C78 130 60 160 30 170" stroke="${shirt}" stroke-width="30" stroke-linecap="round" fill="none"/><circle cx="-28" cy="172" r="15" fill="${skin}"/><circle cx="28" cy="172" r="15" fill="${skin}"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">
    ${hairBack}
    <rect x="-56" y="62" width="112" height="150" rx="44" fill="${shirt}"/>
    <path d="M-22 62L0 96L22 62Z" fill="#fff"/>
    ${armPath}
    <rect x="-14" y="48" width="28" height="22" fill="${skin}"/>
    <circle cx="-58" cy="8" r="11" fill="${skin}"/><circle cx="58" cy="8" r="11" fill="${skin}"/>
    <circle cx="0" cy="0" r="58" fill="${skin}"/>
    ${hairTop}
    <circle cx="-21" cy="6" r="7" fill="#3b2a20"/><circle cx="21" cy="6" r="7" fill="#3b2a20"/>
    <circle cx="-19" cy="3" r="2.4" fill="#fff"/><circle cx="23" cy="3" r="2.4" fill="#fff"/>
    <circle cx="-34" cy="26" r="8" fill="#ff8aa8" opacity=".45"/><circle cx="34" cy="26" r="8" fill="#ff8aa8" opacity=".45"/>
    <path d="M-16 28Q0 46 16 28" stroke="#b5473a" stroke-width="6" fill="none" stroke-linecap="round"/>
  </g>`;
}

/** Places a child so that the bottom of the body sits at `bottom` (kid body ends 212 units below its centre). */
const place = (x, bottom, s, opts) => kid(x, bottom - 212 * s, s, opts);

const book = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${c}"/><rect x="${x + 6}" y="${y + 10}" width="${w - 12}" height="6" rx="3" fill="#fff" opacity=".55"/>`;

const shelf = (w, h) => {
  const y = h * 0.32;
  const cols = [C.pink, C.green, C.navy, C.sun, C.orange, "#7c4dff"];
  const row = (yy) => cols.map((c, i) => book(w * 0.06 + i * w * 0.045, yy - (i % 3) * 8 - h * 0.1, w * 0.036, h * 0.1 + (i % 3) * 8, c)).join("");
  return `<rect x="${w * 0.04}" y="${y}" width="${w * 0.3}" height="8" rx="4" fill="${C.wood}"/>${row(y)}
    <rect x="${w * 0.04}" y="${y + h * 0.16}" width="${w * 0.3}" height="8" rx="4" fill="${C.wood}"/>${row(y + h * 0.16)}`;
};

const windowArt = (w, h) => `<g transform="translate(${w * 0.68} ${h * 0.1})">
  <rect width="${w * 0.26}" height="${h * 0.3}" rx="14" fill="#fff" opacity=".7"/><rect x="8" y="8" width="${w * 0.26 - 16}" height="${h * 0.3 - 16}" rx="10" fill="${C.sky}"/>
  <circle cx="${w * 0.17}" cy="${h * 0.1}" r="${h * 0.045}" fill="${C.sun}"/><ellipse cx="${w * 0.08}" cy="${h * 0.17}" rx="${w * 0.05}" ry="${h * 0.025}" fill="#fff"/></g>`;

const desk = (w, h, y = 0.74) => `<rect x="${w * 0.08}" y="${h * y}" width="${w * 0.84}" height="${h * 0.05}" rx="10" fill="${C.wood}"/>
  <rect x="${w * 0.14}" y="${h * (y + 0.05)}" width="${w * 0.04}" height="${h * 0.2}" fill="#a97040"/><rect x="${w * 0.82}" y="${h * (y + 0.05)}" width="${w * 0.04}" height="${h * 0.2}" fill="#a97040"/>`;

const openBook = (x, y, w) => `<path d="M${x} ${y}L${x + w / 2} ${y - w * 0.08}L${x + w} ${y}L${x + w} ${y + w * 0.12}L${x + w / 2} ${y + w * 0.05}L${x} ${y + w * 0.12}Z" fill="#fff" stroke="#e4e4e4" stroke-width="3"/><path d="M${x + w / 2} ${y - w * 0.08}V${y + w * 0.05}" stroke="#d6d6d6" stroke-width="3"/>`;

const pencil = (x, y, rot, c) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect width="90" height="14" rx="3" fill="${c}"/><path d="M90 0L112 7L90 14Z" fill="#f4d9b0"/></g>`;

const SCENES = {
  hero: (w, h) => `${shelf(w, h)}${windowArt(w, h)}${desk(w, h)}
    ${place(w * 0.31, h * 0.8, w / 760, { shirt: C.green, hair: "#2b1a12", style: "pigtails", skin: SKIN[0] })}
    ${place(w * 0.69, h * 0.8, w / 760, { shirt: C.navy, hair: "#4a2c17", style: "short", skin: SKIN[1] })}
    ${desk(w, h)}${openBook(w * 0.33, h * 0.72, w * 0.34)}${pencil(w * 0.74, h * 0.72, -12, C.pink)}`,
  blocks: (w, h) => `${windowArt(w, h)}
    ${[0, 1, 2].map((i) => `<rect x="${w * (0.1 + i * 0.15)}" y="${h * 0.82}" width="${w * 0.14}" height="${w * 0.14}" rx="8" fill="${[C.pink, C.navy, C.green][i]}"/>`).join("")}
    <rect x="${w * 0.175}" y="${h * 0.82 - w * 0.14}" width="${w * 0.14}" height="${w * 0.14}" rx="8" fill="${C.sun}"/>
    ${place(w * 0.7, h * 0.97, w / 560, { shirt: C.pink, hair: "#2b1a12", style: "pigtails", arms: "up" })}`,
  book: (w, h) => `${shelf(w, h)}${desk(w, h, 0.8)}
    ${place(w * 0.5, h * 0.84, w / 560, { shirt: C.navy, hair: "#2b1a12", style: "pigtails" })}${desk(w, h, 0.8)}${openBook(w * 0.3, h * 0.78, w * 0.4)}`,
  paint: (w, h) => `
    ${[0, 1, 2, 3, 4].map((i) => `<circle cx="${w * (0.12 + i * 0.19)}" cy="${h * (0.2 + (i % 2) * 0.14)}" r="${w * 0.06}" fill="${[C.pink, C.sun, C.green, C.navy, C.orange][i]}" opacity=".85"/>`).join("")}
    ${place(w * 0.5, h * 0.97, w / 600, { shirt: C.green, hair: "#4a2c17", style: "short", arms: "up", skin: SKIN[2] })}`,
  play: (w, h) => `<path d="M${w * 0.06} ${h * 0.94}L${w * 0.32} ${h * 0.3}L${w * 0.58} ${h * 0.94}Z" fill="${C.sun}"/><path d="M${w * 0.16} ${h * 0.94}L${w * 0.32} ${h * 0.54}L${w * 0.48} ${h * 0.94}Z" fill="${C.orange}"/>
    <circle cx="${w * 0.82}" cy="${h * 0.2}" r="${w * 0.08}" fill="${C.sun}" opacity=".75"/>
    ${place(w * 0.72, h * 0.97, w / 620, { shirt: C.pink, hair: "#2b1a12", style: "pigtails", arms: "up" })}`,
};

function svg(name, w, h, bgA, bgB, scene, label) {
  const body = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bgA}"/><stop offset="1" stop-color="${bgB}"/></linearGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <circle cx="${w * 0.1}" cy="${h * 0.16}" r="${w * 0.05}" fill="#fff" opacity=".5"/><circle cx="${w * 0.92}" cy="${h * 0.78}" r="${w * 0.08}" fill="#fff" opacity=".35"/>
  ${leaf(-10, h * 0.9, 1.4, -30, "#9ccc65")}${leaf(w * 0.94, h * 0.06, 1.2, 140, "#81c784")}
  <rect y="${h * 0.93}" width="${w}" height="${h * 0.07}" fill="#fff" opacity=".35"/>
  ${SCENES[scene](w, h)}
</svg>`;
  writeFileSync(new URL(name, OUT), body);
}

svg("hero.svg", 1100, 800, "#d8ecd2", "#ffe3ec", "hero", "Two smiling Study Point children learning together at a desk");
svg("nursery.svg", 800, 700, "#ffe3ec", "#fff3d6", "blocks", "A nursery child playing with colourful blocks");
svg("classes.svg", 800, 700, "#dbe8ff", "#eaf3ff", "book", "A student reading in class");
svg("why.svg", 800, 700, "#e8f3e4", "#fff0d9", "book", "A child reading a book");
svg("about.svg", 1000, 760, "#e8f3e4", "#e7eefb", "hero", "Study Point students in the classroom");

const g = [
  ["#d8ecd2", "#fff3d6", "book"], ["#ffe3ec", "#e7eefb", "blocks"], ["#fff3d6", "#ffe3ec", "paint"], ["#dbe8ff", "#e8f3e4", "hero"],
  ["#e8f3e4", "#cfe3ff", "play"], ["#ffe3ec", "#fff3d6", "blocks"], ["#dbe8ff", "#ffe3ec", "paint"], ["#fff3d6", "#d8ecd2", "play"],
];
g.forEach(([a, b, s], i) => svg(`gallery-${i + 1}.svg`, 800, 600, a, b, s, `Learning activity illustration ${i + 1}`));
console.log("placeholders written");
