import { build } from "esbuild"
import { AssetTransformer } from "./asset-builder.js"

export const transformEsbuild: AssetTransformer = {
  async transform(inputFile) {
    if (inputFile.match(/\.[jt]sx?$/)) {
      const scriptBuild = await build({
        entryPoints: [inputFile],
        bundle: true,
        target: ["chrome89", "firefox89"],
        format: "esm",
        write: false,
      })

      return {
        content: scriptBuild.outputFiles[0]!.text,
        type: "text/javascript",
      }
    }
  },
}
