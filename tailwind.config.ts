import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
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
        },
      },
    },
  },
  plugins: [],
};

export default config;
