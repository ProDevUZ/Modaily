import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: "#f5ecdc",
        ink: "#1f1a17",
        blush: "#d98d7f",
        clay: "#a56152",
        moss: "#52624c",
        gold: "#c7a260"
      },
      boxShadow: {
        glow: "0 20px 80px rgba(165, 97, 82, 0.18)"
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.8), transparent 30%), radial-gradient(circle at 80% 0%, rgba(217,141,127,0.2), transparent 32%), linear-gradient(135deg, rgba(245,236,220,0.98), rgba(255,248,238,0.9))"
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial", "sans-serif"],
        body: ["var(--font-body)", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
