/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        accent: "#0f4c81",
        accentSoft: "#e7eff8"
      },
      boxShadow: {
        soft: "0 14px 36px rgba(15, 76, 129, 0.12)",
        night: "0 14px 36px rgba(2, 8, 23, 0.45)"
      }
    }
  },
  plugins: []
};
