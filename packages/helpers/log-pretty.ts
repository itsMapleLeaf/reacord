import { inspect } from "node:util"

export function logPretty(value: unknown) {
	console.info(
		inspect(value, {
			// depth: Number.POSITIVE_INFINITY,
			depth: 10,
			colors: true,
		}),
	)
}
