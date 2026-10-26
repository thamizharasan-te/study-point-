import type { Config } from "tailwindcss";

// Palette taken from the approved design: leaf green, rose pink, navy, warm cream.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Colours come from CSS variables so a theme can change them all at once (see src/lib/themes.ts).
        brand: {
          green: "rgb(var(--c-green) / <alpha-value>)",
          "green-dark": "rgb(var(--c-green-dark) / <alpha-value>)",
          "green-soft": "rgb(var(--c-green-soft) / <alpha-value>)",
          pink: "rgb(var(--c-pink) / <alpha-value>)",
          "pink-dark": "rgb(var(--c-pink-dark) / <alpha-value>)",
          "pink-soft": "rgb(var(--c-pink-soft) / <alpha-value>)",
          navy: "rgb(var(--c-navy) / <alpha-value>)",
          "navy-dark": "rgb(var(--c-navy-dark) / <alpha-value>)",
          "navy-soft": "rgb(var(--c-navy-soft) / <alpha-value>)",
          cream: "rgb(var(--c-cream) / <alpha-value>)",
          ink: "#1f2937",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "var(--font-tamil)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      boxShadow: {
        card: "0 8px 30px -12px rgba(20, 48, 107, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
