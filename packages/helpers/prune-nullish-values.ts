import { isObject } from "./is-object"

export function pruneNullishValues<T>(input: T): PruneNullishValues<T> {
	if (!isObject(input)) {
		return input as PruneNullishValues<T>
	}

	if (Array.isArray(input)) {
		return input
			.filter(Boolean)
			.map(
				(item) => pruneNullishValues(item) as unknown,
			) as PruneNullishValues<T>
	}

	const result: Record<string, unknown> = {}
	for (const [key, value] of Object.entries(input)) {
		if (value != undefined) {
			result[key] = pruneNullishValues(value)
		}
	}
	return result as PruneNullishValues<T>
}

export type PruneNullishValues<Input> = Input extends object
	? OptionalKeys<
			{ [Key in keyof Input]: NonNullable<PruneNullishValues<Input[Key]>> },
			KeysWithNullishValues<Input>
	  >
	: Input

type OptionalKeys<Input, Keys extends keyof Input> = Omit<Input, Keys> & {
	[Key in Keys]?: Input[Key]
}

type KeysWithNullishValues<Input> = NonNullable<
	Values<{
		[Key in keyof Input]: null extends Input[Key]
			? Key
			: undefined extends Input[Key]
			? Key
			: never
	}>
>

type Values<Input> = Input[keyof Input]
