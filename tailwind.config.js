/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1F2421",
        chalk: "#F6F2E9",
        clay: "#A8543A",
        turf: "#1B4332",
        brass: "#C9A227",
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
