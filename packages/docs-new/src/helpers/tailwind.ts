import type { RequestHandler } from "express"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import type { Result } from "postcss"
import postcss from "postcss"
import tailwindcss from "tailwindcss"

const tailwindTemplate = await readFile(
  fileURLToPath(await import.meta.resolve!("tailwindcss/tailwind.css")),
  "utf-8",
)

let result: Result | undefined

export function serveTailwindCss(): RequestHandler {
  return async (req, res) => {
    if (!result || process.env.NODE_ENV !== "production") {
      result = await postcss(tailwindcss).process(tailwindTemplate)
    }
    res.set("Content-Type", "text/css").send(result.css)
  }
}
