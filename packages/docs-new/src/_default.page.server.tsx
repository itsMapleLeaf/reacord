import React from "react"
import { renderToStaticMarkup, renderToString } from "react-dom/server.js"
import { HeadProvider } from "react-head"
import type { PageContextBuiltIn } from "vite-plugin-ssr"
import { dangerouslySkipEscape, escapeInject } from "vite-plugin-ssr"
import { App } from "./app"

export const passToClient = ["routeParams"]

export function render(context: PageContextBuiltIn) {
  const headTags: React.ReactElement[] = []

  const pageHtml = renderToString(
    <HeadProvider headTags={headTags}>
      <App>
        <context.Page />
      </App>
    </HeadProvider>,
  )

  const documentHtml = escapeInject/* HTML */ `
    <!DOCTYPE html>
    <html lang="en" class="bg-slate-900 text-slate-100">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&family=Rubik:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap"
          rel="stylesheet"
        />
        ${dangerouslySkipEscape(renderToStaticMarkup(<>{headTags}</>))}
      </head>
      <body>
        <div id="app" class="contents">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>
  `

  return { documentHtml }
}
