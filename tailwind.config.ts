import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "1.5rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1120px",
        "2xl": "1120px",
      },
    },
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
