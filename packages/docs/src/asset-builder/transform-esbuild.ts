import { build } from "esbuild"
import { readFile } from "node:fs/promises"
import { dirname } from "node:path"
import { AssetTransformer } from "./asset-builder.js"

export const transformEsbuild: AssetTransformer = {
  async transform(asset) {
    if (asset.file.match(/\.tsx?$/)) {
      const scriptBuild = await build({
        bundle: true,
        stdin: {
          contents: await readFile(asset.file, "utf-8"),
          sourcefile: asset.file,
          loader: "tsx",
          resolveDir: dirname(asset.file),
        },
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
