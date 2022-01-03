import compression from "compression"
import type { ErrorRequestHandler, Request } from "express"
import express from "express"
import Router from "express-promise-router"
import httpTerminator from "http-terminator"
import pino from "pino"
import pinoHttp from "pino-http"
import * as React from "react"
import { renderMarkdownFile } from "./helpers/markdown"
import { sendJsx } from "./helpers/send-jsx"
import { serveCompiledScript } from "./helpers/serve-compiled-script"
import { serveFile } from "./helpers/serve-file"
import { serveTailwindCss } from "./helpers/tailwind"
import DocsPage from "./pages/docs"
import { Landing } from "./pages/landing"

const logger = pino()
const port = process.env.PORT || 3000

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  response.status(500).send(error.message)
  logger.error(error)
}

const router = Router()
  .use(pinoHttp({ logger }))
  .use(compression())
  .get("/tailwind.css", serveTailwindCss())

  .get(
    "/prism-theme.css",
    serveFile(new URL("./styles/prism-theme.css", import.meta.url).pathname),
  )

  .get(
    "/popover-menu.client.js",
    await serveCompiledScript(
      new URL("./components/popover-menu.client.tsx", import.meta.url).pathname,
    ),
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

  .use(errorHandler)

const server = express()
  .use(router)
  .listen(port, () => {
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
