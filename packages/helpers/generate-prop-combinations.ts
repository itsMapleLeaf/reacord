export function generatePropCombinations<P>(values: {
  [K in keyof P]: ReadonlyArray<P[K]>
}) {
  return generatePropCombinationsRecursive(values) as P[]
}

function generatePropCombinationsRecursive(
  value: Record<string, readonly unknown[]>,
): Array<Record<string, unknown>> {
  const [key] = Object.keys(value)
  if (!key) return [{}]

  const { [key]: values = [], ...otherValues } = value
  const result: Array<Record<string, unknown>> = []
  for (const value of values) {
    for (const otherValue of generatePropCombinationsRecursive(otherValues)) {
      result.push({ [key]: value, ...otherValue })
    }
  }
  return result
}
