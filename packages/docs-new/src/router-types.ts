import type { Promisable } from "type-fest"
import type { PageContextBuiltIn } from "vite-plugin-ssr"

export type OnBeforeRenderFn<PageProps> = (
  context: PageContextBuiltIn,
) => Promisable<{
  pageContext: {
    pageData: PageProps
  }
}>
