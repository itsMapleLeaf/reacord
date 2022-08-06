import { spawnSync } from "node:child_process"
import { createRequire } from "node:module"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { beforeAll, expect, test } from "vitest"

beforeAll(() => {
  spawnSync("pnpm", ["run", "build"], {
    cwd: join(fileURLToPath(import.meta.url), ".."),
  })
})

test("can require commonjs", () => {
  const require = createRequire(import.meta.url)
  expect(() => require("../dist/main.cjs")).not.toThrow()
})
