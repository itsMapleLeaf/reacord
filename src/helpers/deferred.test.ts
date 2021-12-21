import { expect, test } from "vitest"
import { createDeferred } from "./deferred.js"

test("resolve", async () => {
  const deferred = createDeferred<string>()
  setTimeout(() => deferred.resolve("hi"))
  expect(await deferred).toBe("hi")
})

test("reject", async () => {
  const deferred = createDeferred()
  const error = new Error("oops")
  setTimeout(() => deferred.reject(error))
  const caught = await Promise.resolve(deferred).catch((error) => error)
  expect(caught).toBe(error)
})
