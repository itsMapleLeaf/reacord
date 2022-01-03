import type { OnBeforeRenderFn } from "../router-types"

export type DocsPageProps = {
  title?: string
  description?: string
  content: string
}

export const onBeforeRender: OnBeforeRenderFn<DocsPageProps> = async (
  context,
) => {
  const documentPath = context.routeParams["*"]
  const document = await import(`../docs/${documentPath}.md`)
  return {
    pageContext: {
      pageData: {
        title: document.attributes.title,
        description: document.attributes.description,
        content: document.html,
      },
    },
  }
}
