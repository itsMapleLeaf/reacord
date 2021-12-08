import { setTimeout } from "node:timers/promises"

export async function rejectAfter(timeMs: number) {
  await setTimeout(timeMs)
  return Promise.reject(`rejected after ${timeMs}ms`)
}
