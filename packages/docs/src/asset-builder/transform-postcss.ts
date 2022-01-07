import postcss from "postcss"
import tailwindcss from "tailwindcss"
import { AssetTransformer } from "./asset-builder.js"

export const transformPostCss: AssetTransformer = {
  async transform(asset) {
    if (!asset.file.match(/\.css$/)) return

    const result = await postcss(tailwindcss).process(asset.content, {
      from: asset.file,
    })
    return {
      content: result.css,
      type: "text/css",
    }
  },
}
