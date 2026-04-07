/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#f97316",
          navy: "#0f172a",
        },
        brown: "#8B5E3C", 
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), 
  ],
};