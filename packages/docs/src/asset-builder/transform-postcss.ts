import autoprefixer from "autoprefixer"
import cssnano from "cssnano"
import { readFile } from "fs/promises"
import postcss, { AcceptedPlugin } from "postcss"
import tailwindcss from "tailwindcss"
import { AssetTransformer } from "./asset-builder.js"

export const transformPostCss: AssetTransformer = {
  async transform(inputFile) {
    if (!inputFile.match(/\.css$/)) return

    const plugins: AcceptedPlugin[] = [tailwindcss, autoprefixer]

    if (process.env.NODE_ENV === "production") {
      plugins.push(cssnano)
    }

    const result = await postcss(plugins).process(await readFile(inputFile), {
      from: inputFile,
    })

    return {
      content: result.css,
      type: "text/css",
    }
  },
}
