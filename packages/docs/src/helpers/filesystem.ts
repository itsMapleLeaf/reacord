import { mkdir, writeFile } from "node:fs/promises"
import { dirname } from "node:path"

export async function ensureWrite(file: string, content: string) {
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, content)
}

export function normalizeAsFilePath(file: string | URL) {
  return new URL(file, "file:").pathname
}
