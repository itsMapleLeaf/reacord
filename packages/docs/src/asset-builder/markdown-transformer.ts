import grayMatter from "gray-matter"
import MarkdownIt from "markdown-it"
import prism from "markdown-it-prism"
import { readFile } from "node:fs/promises"
import type { AssetTransformer } from "./asset-builder.jsx"

const renderer = new MarkdownIt({
  html: true,
  linkify: true,
}).use(prism)

export type MarkdownAsset = {
  content: { __html: string }
  data: Record<string, any>
}

export const markdownTransformer: AssetTransformer<MarkdownAsset> = {
  async transform(context) {
    const { data, content } = grayMatter(
      await readFile(context.inputFile, "utf8"),
    )
    const html = renderer.render(content)

    return {
      content: { __html: html },
      data,
    }
  },
}
