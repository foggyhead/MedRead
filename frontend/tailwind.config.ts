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
        bg: "#0a0a0a",
        surface: "#111111",
        card: "#1a1a1a",
        border: "#2a2a2a",
        accent: "#7c6af7",
        mint: "#22d3a5",
        textprimary: "#f0f0f0",
        textsecondary: "#888888",
        danger: "#f87171",
        success: "#4ade80",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(124,106,247,0.15)",
        "glow-mint": "0 0 20px rgba(34,211,165,0.15)",
      },
      animation: {
        breathe: "breathe 3s ease-in-out infinite",
        "pulse-slow": "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
        flip: "flip 6s ease-in-out infinite",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.03)", opacity: "0.9" },
        },
        flip: {
          "0%, 40%": { transform: "rotateY(0deg)" },
          "50%, 90%": { transform: "rotateY(180deg)" },
          "100%": { transform: "rotateY(0deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
