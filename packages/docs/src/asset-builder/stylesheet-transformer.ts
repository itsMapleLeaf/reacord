import autoprefixer from "autoprefixer"
import cssnano from "cssnano"
import { readFile } from "node:fs/promises"
import type { AcceptedPlugin } from "postcss"
import postcss from "postcss"
import tailwindcss from "tailwindcss"
import type { AssetTransformer } from "./asset-builder.jsx"

export type StylesheetAsset = { url: string }

export const stylesheetTransformer: AssetTransformer<StylesheetAsset> = {
  async transform(context) {
    const plugins: AcceptedPlugin[] = [tailwindcss, autoprefixer]
    if (process.env.NODE_ENV === "production") {
      plugins.push(cssnano)
    }

    const result = await postcss(plugins).process(
      await readFile(context.inputFile),
      { from: context.inputFile },
    )

    const { outputFileName } = await context.writeOutputFile(result.css)
    return { url: "/" + outputFileName }
  },
}
