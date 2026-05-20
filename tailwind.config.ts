import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f2428",
        muted: "#6f756f",
        line: "#e4e1d8",
        paper: "#fbfaf6",
        panel: "#ffffff",
        sage: "#75836f",
        clay: "#b66d55",
        steel: "#617083"
      },
      boxShadow: {
        soft: "0 12px 40px rgba(31, 36, 40, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
