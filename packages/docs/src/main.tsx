import compression from "compression"
import type { ErrorRequestHandler, Request, Response } from "express"
import express from "express"
import Router from "express-promise-router"
import httpTerminator from "http-terminator"
import pino from "pino"
import pinoHttp from "pino-http"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server.js"
import { AssetBuilderProvider } from "./asset-builder/asset-builder-context.js"
import { AssetBuilder } from "./asset-builder/asset-builder.js"
import { transformEsbuild } from "./asset-builder/transform-esbuild.js"
import { transformPostCss } from "./asset-builder/transform-postcss.js"
import { fromProjectRoot } from "./constants"
import GuidePage from "./guides/guide-page"
import { renderMarkdownFile } from "./helpers/markdown"
import { Html } from "./html.js"
import { Landing } from "./landing/landing"

const logger = pino()
const port = process.env.PORT || 3000

const assets = new AssetBuilder(fromProjectRoot(".asset-cache"), [
  transformEsbuild,
  transformPostCss,
])

export function sendJsx(res: Response, jsx: React.ReactElement) {
  res.set("Content-Type", "text/html")
  res.send(`<!DOCTYPE html>\n${renderToStaticMarkup(jsx)}`)
}

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  response.status(500).send(error.message)
  logger.error(error)
}

const router = Router()
  .use(pinoHttp({ logger }))
  .use(compression())
  .use(assets.middleware())

  .get("/guides/*", async (req: Request<{ 0: string }>, res) => {
    const { html, data } = await renderMarkdownFile(
      new URL(`guides/${req.params[0]}.md`, import.meta.url).pathname,
    )
    sendJsx(
      res,
      <AssetBuilderProvider value={assets}>
        <Html title={`${data.title} | Reacord`} description={data.description}>
          <GuidePage html={html} />
        </Html>
      </AssetBuilderProvider>,
    )
  })

  .get("/", (req, res) => {
    sendJsx(
      res,
      <AssetBuilderProvider value={assets}>
        <Html>
          <Landing />
        </Html>
      </AssetBuilderProvider>,
    )
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
