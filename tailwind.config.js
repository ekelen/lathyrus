/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{jsx,js}", "./build/index.html", "./index.html"],
  theme: {
    fontFamily: {
      body: ["'Share Tech Mono'", "monospace"],
      alchemy: ["NewtonSans", "sans-serif"],
    },
    extend: {
      colors: {
        black: "rgb(4, 6, 8)",
        white: "#f0f0f0",
      },
    },
  },
  plugins: [],
};
