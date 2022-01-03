import { unlink, writeFile } from "node:fs/promises"
import type { Plugin } from "vite"
import { transformWithEsbuild } from "vite"

const prevalPattern = /\.preval\.(js|ts|jsx|tsx|mts|cts)$/

export function preval(): Plugin {
  return {
    name: "preval",
    enforce: "pre",

    async transform(code, filePath) {
      if (!prevalPattern.test(filePath)) return

      const tempFilePath = `${filePath}.preval.mjs`

      try {
        const transformResult = await transformWithEsbuild(code, filePath, {
          target: "node16",
          format: "esm",
        })

        await writeFile(tempFilePath, transformResult.code)
        const runResult = await import(tempFilePath)

        const serialized = Object.entries(runResult)
          .map(([key, value]) => {
            return key === "default"
              ? `export default ${JSON.stringify(value)}`
              : `export const ${key} = ${JSON.stringify(value)}`
          })
          .join("\n")

        return serialized + "\n"
      } finally {
        await unlink(tempFilePath).catch(console.warn)
      }
    },
  }
}
