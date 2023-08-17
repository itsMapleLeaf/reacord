import { camelCaseDeep, snakeCaseDeep } from "./convert-object-property-case"
import type {
	CamelCasedPropertiesDeep,
	SnakeCasedPropertiesDeep,
} from "type-fest"
import { expect, test } from "vitest"

test("camelCaseDeep", () => {
	const input = {
		some_prop: {
			some_deep_prop: "some_deep_value",
		},
		someOtherProp: "someOtherValue",
	}

	const expected: CamelCasedPropertiesDeep<typeof input> = {
		someProp: {
			someDeepProp: "some_deep_value",
		},
		someOtherProp: "someOtherValue",
	}

	expect(camelCaseDeep(input)).toEqual(expected)
})

test("snakeCaseDeep", () => {
	const input = {
		someProp: {
			someDeepProp: "someDeepValue",
		},
		some_other_prop: "someOtherValue",
	}

	const expected: SnakeCasedPropertiesDeep<typeof input> = {
		some_prop: {
			some_deep_prop: "someDeepValue",
		},
		some_other_prop: "someOtherValue",
	}

	expect(snakeCaseDeep(input)).toEqual(expected)
})
