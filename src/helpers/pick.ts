// eslint-disable-next-line import/no-unused-modules
export function pick<T, K extends keyof T>(
  object: T,
  ...keys: K[]
): Pick<T, K> {
  const result: any = {}
  for (const key of keys) {
    const value = object[key]
    if (value !== undefined) {
      result[key] = value
    }
  }
  return result
}
