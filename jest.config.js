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
}
export default config
