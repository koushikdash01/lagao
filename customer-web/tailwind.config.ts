import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        cream: "#f6f5f1",
        clay: "#b7653f"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(20, 83, 45, 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
