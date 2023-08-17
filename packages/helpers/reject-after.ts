import { toError } from "./to-error.js"
import { setTimeout } from "node:timers/promises"

export async function rejectAfter(
	timeMs: number,
	error: unknown = `rejected after ${timeMs}ms`,
): Promise<never> {
	await setTimeout(timeMs)
	throw toError(error)
}
