export async function renderMarkdown(
  markdown: string,
): Promise<{ __html: string }> {
  const rehypePrism = import("rehype-prism-plus").then(
    (module) => module.default,
  )
  const rehypeStringify = import("rehype-stringify").then(
    (module) => module.default,
  )
  const remarkParse = import("remark-parse").then((module) => module.default)
  const remarkRehype = import("remark-rehype").then((module) => module.default)
  const { unified } = await import("unified")

  const processor = unified()
    .use(await remarkParse)
    .use(await remarkRehype)
    .use(await rehypeStringify)
    .use(await rehypePrism)

  const result = await processor.process(markdown)

  return { __html: result.toString() }
}
