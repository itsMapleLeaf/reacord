import { renderToString } from "react-dom/server"
import { HeadProvider } from "react-head"
import { StaticRouter } from "react-router-dom/server"
import { App } from "./app"

export async function render(url: string) {
  const headTags: React.ReactElement[] = []

  const app = renderToString(
    <StaticRouter location={url}>
      <HeadProvider headTags={headTags}>
        <App />
      </HeadProvider>
    </StaticRouter>,
  )

  const scriptSource = import.meta.env.PROD
    ? "/entry.client.js"
    : "/src/entry.client.tsx"

  return /* HTML */ `
    <!DOCTYPE html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&family=Rubik:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/src/tailwind.css" />
      ${renderToString(<>{headTags}</>)}
      <script type="module" src="${scriptSource}"></script>
    </head>
    <body>
      <div id="app" style="display: contents">${app}</div>
    </body>
  `
}
