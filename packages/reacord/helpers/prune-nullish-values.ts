import { isObject } from "./is-object"

export function pruneNullishValues<T>(input: T): PruneNullishValues<T> {
  if (Array.isArray(input)) {
    return input.filter(Boolean).map((item) => pruneNullishValues(item)) as any
  }

  if (!isObject(input)) {
    return input as any
  }

  const result: any = {}
  for (const [key, value] of Object.entries(input)) {
    if (value != undefined) {
      result[key] = isObject(value) ? pruneNullishValues(value) : value
    }
  }
  return result
}

type PruneNullishValues<Input> = Input extends ReadonlyArray<infer Value>
  ? ReadonlyArray<NonNullable<Value>>
  : Input extends object
  ? {
      [Key in keyof Input]: NonNullable<Input[Key]>
    }
  : Input
