import test from "ava"
import { deferred } from "./deferred.js"

test("resolve", async (t) => {
  const d = deferred<string>()
  setTimeout(() => d.resolve("hi"))
  t.is(await d, "hi")
})

test("reject", async (t) => {
  const d = deferred()
  setTimeout(() => d.reject(new Error("oops")))
  await t.throwsAsync(() => d, { instanceOf: Error, message: "oops" })
})
