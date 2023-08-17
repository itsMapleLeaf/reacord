import { inspect } from "node:util"

export function withLoggedMethodCalls<T extends object>(value: T) {
	return new Proxy(value as Record<string | symbol, unknown>, {
		get(target, property) {
			const value = target[property]
			if (typeof value !== "function") {
				return value
			}
			return (...values: unknown[]) => {
				console.info(
					`${String(property)}(${values
						.map((value) =>
							typeof value === "object" && value !== null
								? value.constructor.name
								: inspect(value, { colors: true }),
						)
						.join(", ")})`,
				)
				return value.apply(target, values)
			}
		},
	}) as T
}
