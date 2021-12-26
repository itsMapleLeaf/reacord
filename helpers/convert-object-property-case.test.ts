import type {
  CamelCasedPropertiesDeep,
  SnakeCasedPropertiesDeep,
} from "type-fest"
import { camelCaseDeep, snakeCaseDeep } from "./convert-object-property-case"

test("camelCaseDeep", () => {
  const input = {
    some_prop: {
      some_deep_prop: "some_deep_value",
    },
    someOtherProp: "someOtherValue",
  }

  expect(camelCaseDeep(input)).toEqual<CamelCasedPropertiesDeep<typeof input>>({
    someProp: {
      someDeepProp: "some_deep_value",
    },
    someOtherProp: "someOtherValue",
  })
})

test("snakeCaseDeep", () => {
  const input = {
    someProp: {
      someDeepProp: "someDeepValue",
    },
    some_other_prop: "someOtherValue",
  }

  expect(snakeCaseDeep(input)).toEqual<SnakeCasedPropertiesDeep<typeof input>>({
    some_prop: {
      some_deep_prop: "someDeepValue",
    },
    some_other_prop: "someOtherValue",
  })
})
