/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  transform: {
    "^.+\\.tsx?$": [
      "esbuild-jest",
      {
        format: "esm",
        sourcemap: true,
      },
    ],
  },
  moduleNameMapper: {
    "(^(\\./|\\.\\./).+)\\.js$": "$1",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  verbose: true,
}

// eslint-disable-next-line import/no-unused-modules
export default config
