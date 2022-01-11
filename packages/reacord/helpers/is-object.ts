export function isObject<T>(
  value: T,
): value is Exclude<T, Primitive | AnyFunction> {
  return typeof value === "object" && value !== null
}
type Primitive = string | number | boolean | undefined | null
type AnyFunction = (...args: any[]) => any
