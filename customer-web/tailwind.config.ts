import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: "#edf8f0",
          100: "#d7f0de",
          500: "#3ca55c",
          700: "#1f6f39",
          900: "#17351f"
        },
        cream: "#f6f5f1",
        clay: "#b7653f"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(23, 53, 31, 0.10)"
      }
    }
  },
  plugins: []
} satisfies Config;
