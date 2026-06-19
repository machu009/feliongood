/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1C1A1A",
        chalk: "#FAF8F5",
        clay: "#A92F2D",
        turf: "#6E1F1E",
        brass: "#AEB2B6",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "stitch-line":
          "repeating-linear-gradient(90deg, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
