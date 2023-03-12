const base = require("@itsmapleleaf/configs/prettier")

module.exports = {
  ...base,
  plugins: [require.resolve("prettier-plugin-astro")],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
}
