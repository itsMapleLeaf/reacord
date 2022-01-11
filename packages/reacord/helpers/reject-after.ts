import { setTimeout } from "node:timers/promises"
import { toError } from "./to-error.js"

export async function rejectAfter(
  timeMs: number,
  error: unknown = `rejected after ${timeMs}ms`,
): Promise<never> {
  await setTimeout(timeMs)
  throw toError(error)
}
