import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "var(--brand-bg)",
          text: "var(--brand-text)",
          primary: "var(--brand-primary)",
          accent: "var(--brand-accent)",
          muted: "var(--brand-muted)",
          blue: {
            50: "#F1F6FA",
            100: "#D4E4F3",
            300: "#78A9D6",
            500: "#306EAA",
            600: "#255789",
            700: "#1A3E63",
          },
          orange: {
            500: "#F26F21",
            600: "#D35400",
          },
          gray: {
            50: "#F5F7FA",
            200: "#E5E5E5",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
