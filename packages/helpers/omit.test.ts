import { expect, test } from "vitest"
import { omit } from "./omit.ts"

test("omit", () => {
	const subject = { a: 1, b: true }
	expect(omit(subject, ["a"])).toStrictEqual({ b: true })
})
