import { renderToString } from "react-dom/server"
import { HeadProvider } from "react-head"
import { StaticRouter } from "react-router-dom/server"
import { App } from "./app"

export function render(url: string, htmlTemplate: string) {
  const headTags: React.ReactElement[] = []

  const app = (
    <StaticRouter location={url}>
      <HeadProvider headTags={headTags}>
        <App />
      </HeadProvider>
    </StaticRouter>
  )

  const appHtml = renderToString(app)

  const scriptSource = import.meta.env.PROD
    ? "/entry.client.js"
    : "/src/entry.client.tsx"

  return htmlTemplate
    .replace(
      "<!--inject-head-->",
      renderToString(
        <>
          {headTags}
          <script type="module" src={scriptSource} />
        </>,
      ),
    )
    .replace("<!--inject-body-->", appHtml)
}
