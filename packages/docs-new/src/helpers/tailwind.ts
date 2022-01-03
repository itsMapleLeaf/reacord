import type { RequestHandler } from "express"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import type { Result } from "postcss"
import postcss from "postcss"
import tailwindcss from "tailwindcss"

const tailwindTemplatePath = fileURLToPath(
  await import.meta.resolve!("tailwindcss/tailwind.css"),
)

const tailwindTemplate = await readFile(tailwindTemplatePath, "utf-8")

let result: Result | undefined

export function serveTailwindCss(): RequestHandler {
  return async (req, res) => {
    if (!result || process.env.NODE_ENV !== "production") {
      result = await postcss(tailwindcss).process(tailwindTemplate, {
        from: tailwindTemplatePath,
      })
    }
    res.set("Content-Type", "text/css").send(result.css)
  }
}
