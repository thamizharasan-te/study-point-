import type { Config } from "tailwindcss";

// Palette taken from the approved design: leaf green, rose pink, navy, warm cream.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#2e7d32",
          "green-dark": "#1f5f25",
          "green-soft": "#e8f3e4",
          pink: "#d81b60",
          "pink-dark": "#ad1457",
          "pink-soft": "#fde8ef",
          navy: "#14306b",
          "navy-dark": "#0e2250",
          "navy-soft": "#e7eefb",
          cream: "#fffaf3",
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
