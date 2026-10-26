/** Header colours the owner can pick (Admin → Website Text). The first one is the default. */
export const HEADER_COLORS: { value: string; label: string }[] = [
  { value: "#ffffff", label: "White" },
  { value: "#fff7ec", label: "Warm cream" },
  { value: "#e8f5e9", label: "Light green" },
  { value: "#e7eefb", label: "Light blue" },
  { value: "#fde7f0", label: "Soft pink" },
  { value: "#2e7d32", label: "Study Point green" },
  { value: "#14306b", label: "Deep navy" },
  { value: "#d81b60", label: "Rose pink" },
  { value: "#1f2937", label: "Charcoal" },
];

export const DEFAULT_HEADER_COLOR = HEADER_COLORS[0].value;

export const isHex = (v: unknown): v is string => typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v);

/** True when white text reads better than dark text on this background. */
export function isDark(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.4;
}
