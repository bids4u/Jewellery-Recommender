/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        silver: {
          light: "#E5E7EB",
          DEFAULT: "#C0C0C0",
          dark: "#6B7280",
        },
        primary: "#2563EB",
        neutral: "#F9FAFB",
      },
      fontFamily: {
        sans: ["Inter", "Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
}
