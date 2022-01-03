import grayMatter from "gray-matter"
import MarkdownIt from "markdown-it"
import prism from "markdown-it-prism"
import { readFile } from "node:fs/promises"

const renderer = new MarkdownIt({
  html: true,
  linkify: true,
}).use(prism)

export async function renderMarkdownFile(filePath: string) {
  const { data, content } = grayMatter(await readFile(filePath, "utf8"))
  const html = renderer.render(content)
  return { html, data }
}
