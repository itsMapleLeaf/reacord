import { inspect } from "node:util"

// eslint-disable-next-line import/no-unused-modules
export function logPretty(value: unknown) {
  console.info(
    inspect(value, {
      // depth: Number.POSITIVE_INFINITY,
      depth: 10,
      colors: true,
    }),
  )
}
