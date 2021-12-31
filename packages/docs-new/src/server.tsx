import express from "express"
import { renderToStaticMarkup } from "react-dom/server"
import { createServer as createViteServer } from "vite"
import type * as entryModule from "./entry.server"

const vite = await createViteServer({
  server: { middlewareMode: "ssr" },
})

const app = express()

app.use(vite.middlewares)

app.use("*", async (req, res) => {
  const url = req.originalUrl

  try {
    const { render } = (await vite.ssrLoadModule(
      "/src/entry.server.tsx",
    )) as typeof entryModule

    const content = renderToStaticMarkup(await render(url))
    const html = await vite.transformIndexHtml(url, content)
    res.status(200).set({ "Content-Type": "text/html" }).end(html)
  } catch (error: any) {
    vite.ssrFixStacktrace(error)
    console.error(error)
    res.status(500).end(error.message)
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})
