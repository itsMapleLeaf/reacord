import { stat } from "node:fs/promises"

export async function isFile(path: string) {
  try {
    const result = await stat(path)
    return result.isFile()
  } catch {
    return false
  }
}
