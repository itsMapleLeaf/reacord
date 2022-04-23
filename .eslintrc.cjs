/** @type {import('eslint').ESLint.Options} */
module.exports = {
  extends: ["./node_modules/@itsmapleleaf/configs/eslint"],
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
  },
  rules: {
    "import/no-unused-modules": "off",
    "unicorn/prevent-abbreviations": "off",
  },
  overrides: [
    {
      files: ["packages/website/cypress/**"],
      parserOptions: {
        project: require.resolve("./packages/website/cypress/tsconfig.json"),
      },
    },
  ],
}
