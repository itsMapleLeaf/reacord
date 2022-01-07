import { readFile } from "fs/promises"
import postcss from "postcss"
import tailwindcss from "tailwindcss"
import { AssetTransformer } from "./asset-builder.js"

export const transformPostCss: AssetTransformer = {
  async transform(inputFile) {
    if (!inputFile.match(/\.css$/)) return

    const result = await postcss(tailwindcss).process(
      await readFile(inputFile),
      { from: inputFile },
    )

    return {
      content: result.css,
      type: "text/css",
    }
  },
}
