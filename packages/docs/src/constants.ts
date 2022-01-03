import { join } from "node:path"

const projectRoot = new URL("../", import.meta.url).pathname

export function fromProjectRoot(...subPaths: string[]) {
  return join(projectRoot, ...subPaths)
}
