import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { velvet: "#0D0D0D", graphite: "#1A1A1A", rose: "#B76E79", gold: "#C9A66B" }, fontFamily: { display: ["\"Playfair Display\"", "Georgia", "serif"], sans: ["Montserrat", "Inter", "Arial", "sans-serif"] } } },
  plugins: [],
} satisfies Config;
