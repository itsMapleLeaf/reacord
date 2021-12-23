import { setTimeout } from "node:timers/promises"
import { expect, test } from "vitest"
import { ActionQueue } from "./action-queue.js"

test("action queue", async () => {
  const queue = new ActionQueue()
  let results: string[] = []

  queue.add({
    id: "a",
    priority: 1,
    run: async () => {
      await setTimeout(100)
      results.push("a")
    },
  })

  queue.add({
    id: "b",
    priority: 0,
    run: async () => {
      await setTimeout(50)
      results.push("b")
    },
  })

  expect(results).toEqual([])
  await queue.done()
  expect(results).toEqual(["b", "a"])
})
