import compression from "compression"
import type { Request, Response } from "express"
import express from "express"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server.js"
import { serveTailwindCss } from "./helpers/tailwind"
import { Landing } from "./pages/landing"

const projectRoot = new URL("..", import.meta.url).pathname

const port = process.env.PORT || 3000

function sendJsx(res: Response, jsx: React.ReactElement) {
  res.set("Content-Type", "text/html")
  res.send(`<!DOCTYPE html>\n${renderToStaticMarkup(jsx)}`)
}

express()
  .use(compression())
  .get("/tailwind.css", serveTailwindCss())

  .get("/", (req, res) => {
    sendJsx(res, <Landing />)
  })

  .get("/docs/:docPath+", (req: Request<{ docPath: string }>, res) => {
    res.send("doc: " + req.params.docPath)
  })

  .listen(port, () => {
    console.info(`Server is running on https://localhost:${port}`)
  })
