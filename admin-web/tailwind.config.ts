import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: "#edf8f0",
          100: "#d5efdc",
          500: "#3ca55c",
          700: "#1f6f39",
          900: "#102517",
        },
        soil: "#6f5a45",
      },
      boxShadow: {
        soft: "0 16px 50px rgba(16, 37, 23, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
