import { spawnSync } from "node:child_process"
import { createRequire } from "node:module"
import { beforeAll, expect, test } from "vitest"

beforeAll(() => {
	spawnSync("pnpm", ["run", "build"])
})

test("can require commonjs", () => {
	const require = createRequire(import.meta.url)
	expect(() => require("../dist/main.cjs")).not.toThrow()
})
