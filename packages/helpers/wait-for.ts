import { setTimeout } from "node:timers/promises"
import type { MaybePromise } from "./types.ts"

const maxTime = 1000

export async function waitFor<Result>(
	predicate: () => MaybePromise<Result>,
): Promise<Awaited<Result>> {
	const startTime = Date.now()
	let lastError: unknown

	while (Date.now() - startTime < maxTime) {
		try {
			return await predicate()
		} catch (error) {
			lastError = error
			await setTimeout(50)
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-throw-literal
	throw lastError ?? new Error("Timeout")
}
