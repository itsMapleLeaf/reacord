import { setTimeout } from "node:timers/promises"
import type { MaybePromise } from "./types.js"

export async function waitFor(condition: () => MaybePromise<boolean>) {
  while (!(await condition())) {
    await setTimeout(100)
  }
}
