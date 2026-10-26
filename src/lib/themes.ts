/**
 * Website colour themes. The owner picks one in Admin → Website Text and every colour on the public site
 * (buttons, headings, cards, footer, header …) changes together. Colours are CSS variables that the
 * Tailwind "brand" colours read (see tailwind.config.ts and globals.css).
 */
export type Theme = {
  id: string;
  label: string;
  description: string;
  primary: string; // main colour (buttons, accents) — "brand-green"
  accent: string; // second colour (highlights) — "brand-pink"
  navy: string; // headings and footer — "brand-navy"
  cream: string; // page background
  header: string; // header bar colour
  /** Exact original shades for the default theme; other themes get them calculated. */
  exact?: Record<string, string>;
};

export const THEMES: Theme[] = [
  {
    id: "classic", label: "Classic Green & Pink", description: "The original Study Point colours.",
    primary: "#2e7d32", accent: "#d81b60", navy: "#14306b", cream: "#fffaf3", header: "#ffffff",
    exact: { "green-dark": "#1f5f25", "green-soft": "#e8f3e4", "pink-dark": "#ad1457", "pink-soft": "#fde8ef", "navy-dark": "#0e2250", "navy-soft": "#e7eefb" },
  },
  { id: "ocean", label: "Ocean Blue", description: "Fresh blue with a warm orange highlight.", primary: "#0b7bb5", accent: "#f57c00", navy: "#0b2e5b", cream: "#f6fafd", header: "#ffffff" },
  { id: "royal", label: "Royal Purple", description: "Rich purple with a golden highlight.", primary: "#7b3fa0", accent: "#e8a010", navy: "#2d1b54", cream: "#fbf8fe", header: "#ffffff" },
  { id: "sunny", label: "Sunny Orange", description: "Warm and cheerful orange with teal.", primary: "#e8710a", accent: "#0e7490", navy: "#4a2511", cream: "#fff8ef", header: "#fff4e0" },
  { id: "rose", label: "Rose Garden", description: "Soft rose with leafy green.", primary: "#c2185b", accent: "#2e7d32", navy: "#4a1233", cream: "#fff8fa", header: "#fff0f5" },
  { id: "forest", label: "Forest Green", description: "Calm deep green with a gold highlight.", primary: "#1b6b3a", accent: "#d98a00", navy: "#0f3d2a", cream: "#f8fbf6", header: "#1b6b3a" },
  { id: "midnight", label: "Midnight Navy", description: "Bold navy header with the classic colours.", primary: "#2e7d32", accent: "#d81b60", navy: "#14306b", cream: "#fffaf3", header: "#14306b", exact: { "green-dark": "#1f5f25", "green-soft": "#e8f3e4", "pink-dark": "#ad1457", "pink-soft": "#fde8ef", "navy-dark": "#0e2250", "navy-soft": "#e7eefb" } },
];

export const DEFAULT_THEME_ID = "classic";

export const getTheme = (id?: string): Theme => THEMES.find((t) => t.id === id) ?? THEMES[0];

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const mix = (hex: string, with_: number, amount: number) => {
  const c = rgb(hex).map((v) => Math.round(v + (with_ - v) * amount));
  return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
};
const channels = (hex: string) => rgb(hex).join(" ");

/** The CSS variables (as "r g b" channels) for a theme. */
export function themeVars(theme: Theme): Record<string, string> {
  const e = theme.exact ?? {};
  const pick = (key: string, fallback: string) => e[key] ?? fallback;
  return {
    "--c-green": channels(theme.primary),
    "--c-green-dark": channels(pick("green-dark", mix(theme.primary, 0, 0.24))),
    "--c-green-soft": channels(pick("green-soft", mix(theme.primary, 255, 0.88))),
    "--c-pink": channels(theme.accent),
    "--c-pink-dark": channels(pick("pink-dark", mix(theme.accent, 0, 0.22))),
    "--c-pink-soft": channels(pick("pink-soft", mix(theme.accent, 255, 0.88))),
    "--c-navy": channels(theme.navy),
    "--c-navy-dark": channels(pick("navy-dark", mix(theme.navy, 0, 0.3))),
    "--c-navy-soft": channels(pick("navy-soft", mix(theme.navy, 255, 0.9))),
    "--c-cream": channels(theme.cream),
  };
}

/** CSS that switches the whole site to a theme (empty for the default, which lives in globals.css). */
export function themeCss(id?: string): string {
  const theme = getTheme(id);
  if (theme.id === DEFAULT_THEME_ID) return "";
  return `:root{${Object.entries(themeVars(theme)).map(([k, v]) => `${k}:${v}`).join(";")}}`;
}
