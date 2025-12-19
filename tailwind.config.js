/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // 60/30/10 (gray / white / pink)
        obsidian: "#0B0B0C", // deep gray (background)
        graphite: "#141416", // surface gray
        ivory: "#F7F7FB", // near-white (text + panels)
        muted: "#A9A9B3", // secondary text

        // Keep existing names for compatibility across the codebase
        rolex: "#FF4DA6", // accent pink
        champagne: "#FFD1E6", // soft pink (subtle highlights)

        // New semantic aliases (optional)
        blush: "#FF4DA6",
        blushSoft: "#FFD1E6",
      },
      borderRadius: { xl2: "1.25rem" },
      boxShadow: {
        soft: "0 12px 40px rgba(0,0,0,.45)",
      },
      letterSpacing: {
        luxe: "0.14em",
      },
    },
  },
  plugins: [],
};
