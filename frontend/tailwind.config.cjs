/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#f4f8fc",
        panel: "#ffffff",
        ink: "#0f172a",
        accent: "#0f4c81",
        accentSoft: "#e7eff8"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 76, 129, 0.08)"
      }
    }
  },
  plugins: []
};
