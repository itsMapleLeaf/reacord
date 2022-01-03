import type { RequestHandler } from "express"

export function serveFile(path: string): RequestHandler {
  return (req, res) => res.sendFile(path)
}
