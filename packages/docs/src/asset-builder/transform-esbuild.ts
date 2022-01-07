import { build } from "esbuild"
import type { AssetTransformer } from "./asset-builder.js"

export const transformEsbuild: AssetTransformer = {
  async transform(inputFile) {
    if (/\.[jt]sx?$/.test(inputFile)) {
      const scriptBuild = await build({
        entryPoints: [inputFile],
        bundle: true,
        target: ["chrome89", "firefox89"],
        format: "esm",
        write: false,
        minify: process.env.NODE_ENV === "production",
      })

      return {
        content: scriptBuild.outputFiles[0]!.text,
        type: "text/javascript",
      }
    }
  },
}
