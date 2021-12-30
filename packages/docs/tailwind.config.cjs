/* eslint-disable unicorn/prefer-module */
// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Rubik", "sans-serif"],
      monospace: ["'JetBrains Mono'", "monospace"],
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
}
