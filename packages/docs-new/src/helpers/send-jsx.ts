import type { Response } from "express"
import { renderToStaticMarkup } from "react-dom/server.js"

export function sendJsx(res: Response, jsx: React.ReactElement) {
  res.set("Content-Type", "text/html")
  res.send(`<!DOCTYPE html>\n${renderToStaticMarkup(jsx)}`)
}
