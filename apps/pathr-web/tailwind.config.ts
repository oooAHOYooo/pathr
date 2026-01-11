import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111",
        paper: "#FAFAFA",
        surface: "#F2F2F2",
        border: "#E5E5E5",
        accent: "#2563EB"
      },
      borderRadius: {
        xl: "12px"
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "\"Segoe UI\"",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif"
        ]
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.04)"
      }
    }
  },
  plugins: []
} satisfies Config;

