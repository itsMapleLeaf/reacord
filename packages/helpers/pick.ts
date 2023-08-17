import type { LoosePick } from "./types"

export function pick<T extends object, K extends keyof T | PropertyKey>(
	object: T,
	keys: K[],
) {
	const keySet = new Set<PropertyKey>(keys)
	return Object.fromEntries(
		Object.entries(object).filter(([key]) => keySet.has(key)),
	) as LoosePick<T, K>
}
