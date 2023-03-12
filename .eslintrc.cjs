require("@rushstack/eslint-patch/modern-module-resolution")

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [require.resolve("@itsmapleleaf/configs/eslint")],
  ignorePatterns: [
    "**/node_modules/**",
    "**/.cache/**",
    "**/build/**",
    "**/dist/**",
    "**/coverage/**",
    "**/public/**",
  ],
  parserOptions: {
    project: require.resolve("./tsconfig.base.json"),
    extraFileExtensions: [".astro"],
  },
  overrides: [
    {
      files: ["packages/website/cypress/**"],
      parserOptions: {
        project: require.resolve("./packages/website/cypress/tsconfig.json"),
      },
    },
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  ],
}
