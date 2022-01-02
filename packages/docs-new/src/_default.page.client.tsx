import React from "react"
import { createRoot } from "react-dom"
import { HeadProvider } from "react-head"
import type { PageContextBuiltInClient } from "vite-plugin-ssr/client"
import { getPage } from "vite-plugin-ssr/client"
import { App } from "./app"

const context = await getPage<PageContextBuiltInClient>()

createRoot(document.querySelector("#app")!).render(
  <HeadProvider>
    <App>
      <context.Page />
    </App>
  </HeadProvider>,
)

declare module "react-dom" {
  export function createRoot(element: Element): {
    render(element: React.ReactNode): void
  }
}
