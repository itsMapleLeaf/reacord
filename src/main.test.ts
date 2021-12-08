import test from "ava"
import { result } from "./main.js"

test("it is b", (t) => {
  t.deepEqual(result, ["b"])
})
