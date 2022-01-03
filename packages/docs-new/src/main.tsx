import compression from "compression"
import express from "express"
import httpTerminator from "http-terminator"
import pino from "pino"
import * as React from "react"
import { sendJsx } from "./helpers/send-jsx"
import { serveFile } from "./helpers/serve-file"
import { serveTailwindCss } from "./helpers/tailwind"
import { Landing } from "./pages/landing"

const logger = pino()
const port = process.env.PORT || 3000

const app = express()
  .use(compression())
  .get("/tailwind.css", serveTailwindCss())

  .get(
    "/prism-theme.css",
    serveFile(new URL("./styles/prism-theme.css", import.meta.url).pathname),
  )

  .get("/", (req, res) => {
    sendJsx(res, <Landing />)
  })

  .get("/docs/:docPath+", (req: Request<{ docPath: string }>, res) => {
    res.send("doc: " + req.params.docPath)
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
