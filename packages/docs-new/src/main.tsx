import compression from "compression"
import type { Request } from "express"
import express from "express"
import httpTerminator from "http-terminator"
import pino from "pino"
import pinoHttp from "pino-http"
import * as React from "react"
import { renderMarkdownFile } from "./helpers/markdown"
import { sendJsx } from "./helpers/send-jsx"
import { serveFile } from "./helpers/serve-file"
import { serveTailwindCss } from "./helpers/tailwind"
import DocsPage from "./pages/docs"
import { Landing } from "./pages/landing"

const logger = pino()
const port = process.env.PORT || 3000

const app = express()
  .use(pinoHttp({ logger }))
  .use(compression())
  .get("/tailwind.css", serveTailwindCss())

  .get(
    "/prism-theme.css",
    serveFile(new URL("./styles/prism-theme.css", import.meta.url).pathname),
  )

  .get("/docs/*", async (req: Request<{ 0: string }>, res) => {
    const { html, data } = await renderMarkdownFile(
      `src/docs/${req.params[0]}.md`,
    )
    sendJsx(
      res,
      <DocsPage
        title={data.title}
        description={data.description}
        html={html}
      />,
    )
  })

  .get("/", (req, res) => {
    sendJsx(res, <Landing />)
  })

const server = app.listen(port, () => {
  logger.info(`Server is running on https://localhost:${port}`)
})

const terminator = httpTerminator.createHttpTerminator({ server })

process.on("SIGINT", () => {
  terminator
    .terminate()
    .then(() => {
      logger.info("Server terminated")
    })
    .catch((error) => {
      logger.error(error)
    })
    .finally(() => {
      process.exit()
    })
})
