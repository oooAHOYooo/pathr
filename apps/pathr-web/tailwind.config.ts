import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Sports palette (dark + bright yellow)
        ink: "#F5F6F7",
        paper: "#192230",
        surface: "#2C2F38",
        border: "#3D474E",
        accent: "#FFCD00"
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

