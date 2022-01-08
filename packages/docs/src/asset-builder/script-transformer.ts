import { build } from "esbuild"
import type { AssetTransformer } from "./asset-builder.jsx"

type ScriptAsset = {
  url: string
}

export const scriptTransformer: AssetTransformer<ScriptAsset> = {
  async transform(context) {
    const scriptBuild = await build({
      entryPoints: [context.inputFile],
      bundle: true,
      target: ["chrome89", "firefox89"],
      format: "esm",
      write: false,
      minify: process.env.NODE_ENV === "production",
    })

    const content = scriptBuild.outputFiles[0]!.text
    const { outputFileName } = await context.writeOutputFile(content)

    return {
      url: "/" + outputFileName,
    }
  },
}
