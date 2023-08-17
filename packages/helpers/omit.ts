export function omit<Subject extends object, Key extends PropertyKey>(
	subject: Subject,
	keys: Key[],
) {
	const keySet = new Set<PropertyKey>(keys)
	return Object.fromEntries(
		Object.entries(subject).filter(([key]) => !keySet.has(key)),
		// hack: conditional type preserves unions
	) as Subject extends unknown ? Omit<Subject, Key> : never
}
