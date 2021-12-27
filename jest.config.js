/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  transform: {
    "^.+\\.[jt]sx?$": ["esbuild-jest", { format: "esm", sourcemap: true }],
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "^(\\.\\.?/.+)\\.jsx?$": "$1",
  },
  verbose: true,
  cache: false,
  coverageReporters: ["text", "text-summary", "html"],
  coveragePathIgnorePatterns: ["discord-js-adapter", "test/setup-testing"],
}
export default config
