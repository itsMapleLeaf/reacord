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
    "(^\\./.+)\\.js$": "$1",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  verbose: true,
}

export default config
