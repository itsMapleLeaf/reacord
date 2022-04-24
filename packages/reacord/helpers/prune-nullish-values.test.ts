import { expect, test } from "vitest"
import { PruneNullishValues, pruneNullishValues } from "./prune-nullish-values"

test("pruneNullishValues", () => {
  type InputType = {
    a: string
    b: string | null | undefined
    c?: string
    d: {
      a: string
      b: string | undefined
    }
  }

  const input: InputType = {
    a: "a",
    b: null,
    c: undefined,
    d: {
      a: "a",
      b: undefined,
    },
  }

  const output: PruneNullishValues<InputType> = {
    a: "a",
    d: {
      a: "a",
    },
  }

  expect(pruneNullishValues(input)).toEqual(output)
})
