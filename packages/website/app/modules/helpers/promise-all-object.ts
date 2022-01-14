export async function promiseAllObject<Input extends object>(
  input: Input,
): Promise<{
  [K in keyof Input]: Awaited<Input[K]>
}> {
  const result: any = {}
  await Promise.all(
    Object.entries(input).map(async ([key, promise]) => {
      result[key] = await promise
    }),
  )
  return result
}
