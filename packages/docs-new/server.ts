import compression from "compression"
import express, { Router } from "express"
import { resolve } from "node:path"
import { createServer as createViteServer } from "vite"
import type * as entryModule from "./src/entry.server"

async function createDevelopmentRouter() {
  const vite = await createViteServer({
    server: { middlewareMode: "ssr" },
  })

  return Router()
    .use(vite.middlewares)
    .use("*", async (req, res) => {
      const url = req.originalUrl

      try {
        const { render } = (await vite.ssrLoadModule(
          "/src/entry.server.tsx",
        )) as typeof entryModule

        const html = await vite.transformIndexHtml(url, await render(url))

        res.status(200).set({ "Content-Type": "text/html" }).end(html)
      } catch (error: any) {
        vite.ssrFixStacktrace(error)
        console.error(error)
        res.status(500).end(error.stack || error.message)
      }
    })
}

function createProductionRouter() {
  return Router()
    .use(compression())
    .use(express.static(resolve("dist/client")))
    .use("*", async (req, res) => {
      try {
        const { render }: typeof entryModule = await import(
          "./dist/server/entry.server"
        )

        res
          .status(200)
          .set({ "Content-Type": "text/html" })
          .end(await render(req.originalUrl))
      } catch (error: any) {
        console.error(error)
        res.status(500).end(error.stack || error.message)
      }
    })
}

const app = express()

if (process.env.NODE_ENV === "production") {
  app.use(createProductionRouter())
} else {
  app.use(await createDevelopmentRouter())
}

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})
