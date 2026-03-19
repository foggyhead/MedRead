import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#030d0a",
        surface: "#071a14",
        card: "#0c2620",
        border: "#163d32",
        accent: "#34d399",
        cyan: "#22d3ee",
        textprimary: "#ecfdf5",
        textsecondary: "#6b9e8f",
        danger: "#f87171",
        success: "#4ade80",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 28px rgba(52,211,153,0.15)",
        "glow-cyan": "0 0 28px rgba(34,211,238,0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
