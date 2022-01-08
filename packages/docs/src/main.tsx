import compression from "compression"
import type { ErrorRequestHandler, Request } from "express"
import express from "express"
import PromiseRouter from "express-promise-router"
import httpTerminator from "http-terminator"
import pino from "pino"
import pinoHttp from "pino-http"
import * as React from "react"
import { AssetBuilder } from "./asset-builder/asset-builder.js"
import { fromProjectRoot } from "./constants"
import { GuidePage } from "./guides/guide-page"
import { Landing } from "./landing/landing"

const port = process.env.PORT || 3000
const builder = await AssetBuilder.create(fromProjectRoot(".asset-cache"))
const logger = pino()

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  response.status(500).send(error.message)
  logger.error(error)
}

const router = PromiseRouter()
  .use(pinoHttp({ logger }))
  .use(compression())
  .use(builder.middleware())

  .get("/guides/*", async (req: Request<{ 0: string }>, res) => {
    res
      .type("html")
      .send(await builder.render(<GuidePage url={req.params[0]} />))
  })

  .get("/", async (req, res) => {
    res.type("html").send(await builder.render(<Landing />))
  })

  .use(errorHandler)

const server = express()
  .use(router)
  .listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`)
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
