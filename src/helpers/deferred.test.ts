import { createDeferred } from "./deferred"

test("resolve", async () => {
  const deferred = createDeferred<string>()
  setTimeout(() => deferred.resolve("hi"))
  expect(await deferred).toBe("hi")
})

test("reject", async () => {
  const deferred = createDeferred()
  const error = new Error("oops")
  setTimeout(() => deferred.reject(error))
  await expect(deferred).rejects.toThrow(error)
})
