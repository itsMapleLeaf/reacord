import React from "react"
import { createRoot } from "react-dom"
import { HeadProvider } from "react-head"
import type { PageContextBuiltInClient } from "vite-plugin-ssr/client"
import { getPage } from "vite-plugin-ssr/client"
import { App } from "./app"
import { RouteContextProvider } from "./route-context"

const context = await getPage<PageContextBuiltInClient>()

createRoot(document.querySelector("#app")!).render(
  <HeadProvider>
    <RouteContextProvider value={{ routeParams: {}, ...context }}>
      <App>
        <context.Page />
      </App>
    </RouteContextProvider>
  </HeadProvider>,
)

declare module "react-dom" {
  export function createRoot(element: Element): {
    render(element: React.ReactNode): void
  }
}
