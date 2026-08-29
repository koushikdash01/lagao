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
        forest: {
          800: "#0b1911",
          900: "#07120c",
          950: "#040b07",
        },
        soil: "#6f5a45",
      },
      boxShadow: {
        soft: "0 10px 30px -5px rgba(16, 37, 23, 0.05)",
        "soft-lg": "0 20px 40px -15px rgba(16, 37, 23, 0.1)",
        glow: "0 0 20px rgba(34, 197, 94, 0.25)",
        "glow-amber": "0 0 20px rgba(245, 158, 11, 0.25)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

