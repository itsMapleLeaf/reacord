import { readFile } from "node:fs/promises"
import type { JSONOutput } from "typedoc"

export type DocsJson = JSONOutput.Reflection

export async function loadDocs(): Promise<DocsJson> {
  return JSON.parse(await readFile("app/docs.json", "utf8"))
}
