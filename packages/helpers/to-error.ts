export function toError(value: unknown) {
	return value instanceof Error ? value : new Error(String(value))
}
