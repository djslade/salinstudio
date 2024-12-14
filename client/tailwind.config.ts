import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        darkest: "#232323",
        homeGray: "#2A2A2A",
        formGray: "#3A3A3A",
        buttonGray: "#D9D9D9",
        linkGray: "#AAAAAA",
        activeGray: "#464646",
      },
      fontFamily: {
        cursive: "var(--font-island-moments)",
        sans: "var(--font-afacad)",
        mono: "var(--ibm-plex-mono)",
      },
    },
  },
  plugins: [],
} satisfies Config;
