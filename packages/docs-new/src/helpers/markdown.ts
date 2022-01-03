import { readFile } from "node:fs/promises"
import rehypeStringify from "rehype-stringify"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify)

export async function renderMarkdownFile(filePath: string) {
  const result = await processor.process(await readFile(filePath))
  return result.toString()
}
