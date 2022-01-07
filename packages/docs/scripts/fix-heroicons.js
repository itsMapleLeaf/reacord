// heroicons doesn't have "sideEffects": false in it's package json,
// which causes esbuild to bundle in 460+ imports of react for some reason,
// which causes memory issues
import glob from "fast-glob"
import { readFile, writeFile } from "node:fs/promises"

const files = await glob("node_modules/@heroicons/react/**/*.json", {
  absolute: true,
})

for (const file of files) {
  const data = JSON.parse(await readFile(file, "utf8"))
  data.sideEffects = false
  await writeFile(file, JSON.stringify(data, undefined, 2))
}
