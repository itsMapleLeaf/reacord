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

  return /* HTML */ `
    <!DOCTYPE html>
    <head>
      ${renderToString(<>{headTags}</>)}
    </head>
    <body>
      ${app}
    </body>
  `
}
