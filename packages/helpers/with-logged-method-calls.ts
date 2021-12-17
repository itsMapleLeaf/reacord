import { inspect } from "node:util"

export function withLoggedMethodCalls<T extends object>(value: T) {
  return new Proxy(value as Record<string | symbol, unknown>, {
    get(target, property) {
      const value = target[property]
      if (typeof value !== "function") {
        return value
      }
      return (...values: any[]) => {
        console.log(
          `${String(property)}(${values
            .map((value) => inspect(value, { depth: 1 }))
            .join(", ")})`,
        )
        return value.apply(target, values)
      }
    },
  }) as T
}
