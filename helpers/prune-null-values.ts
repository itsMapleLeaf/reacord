export function pruneNullishValues<T extends object>(
  object: T,
): PruneNullishValues<T> {
  const result: any = {}
  for (const [key, value] of Object.entries(object)) {
    if (value != undefined) {
      result[key] = value
    }
  }
  return result
}

type PruneNullishValues<T> = {
  [Key in keyof T]: NonNullable<T[Key]>
}
