// @ts-nocheck
module.exports = {
  content: ["./app/**/*.{ts,tsx,md}"],
  theme: {
    fontFamily: {
      sans: ["Rubik", "sans-serif"],
      monospace: ["'JetBrains Mono'", "monospace"],
    },
    boxShadow: {
      DEFAULT: "0 2px 9px 0 rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)",
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
}
