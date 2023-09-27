import { setTimeout } from "node:timers/promises"

const maxTime = 500
const waitPeriod = 50

export async function retryWithTimeout<T>(
	callback: () => Promise<T> | T,
): Promise<T> {
	const startTime = Date.now()
	// eslint-disable-next-line no-constant-condition, @typescript-eslint/no-unnecessary-condition
	while (true) {
		try {
			return await callback()
		} catch (error) {
			if (Date.now() - startTime > maxTime) {
				throw error
			}
			await setTimeout(waitPeriod)
		}
	}
}
