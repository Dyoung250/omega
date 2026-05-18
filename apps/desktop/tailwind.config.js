/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        forge: {
          900: "#0a0a0b",
          800: "#111113",
          700: "#1a1a1d",
          600: "#242428",
          500: "#2e2e34",
          400: "#3a3a42",
          accent: "#c8963e",
          "accent-hover": "#d4a54e",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
