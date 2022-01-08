import grayMatter from "gray-matter"
import MarkdownIt from "markdown-it"
import prism from "markdown-it-prism"
import { readFile } from "node:fs/promises"
import type { AssetTransformer } from "./asset-builder.js"

const renderer = new MarkdownIt({
  html: true,
  linkify: true,
}).use(prism)

export const transformMarkdown: AssetTransformer = {
  async transform(inputFile) {
    if (!/\.md$/.test(inputFile)) return

    const { data, content } = grayMatter(await readFile(inputFile, "utf8"))
    const html = renderer.render(content)

    return {
      content: html,
      type: "text/html",
    }
  },
}
