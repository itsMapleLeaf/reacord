import test from "ava"
import { createDeferred } from "./deferred.js"

test("resolve", async (t) => {
  const deferred = createDeferred<string>()
  setTimeout(() => deferred.resolve("hi"))
  t.is(await deferred, "hi")
})

test("reject", async (t) => {
  const deferred = createDeferred()
  setTimeout(() => deferred.reject(new Error("oops")))
  await t.throwsAsync(() => deferred, { instanceOf: Error, message: "oops" })
})
