export function omit<Subject extends object, Key extends keyof Subject>(
  subject: Subject,
  ...keys: Key[]
): Omit<Subject, Key> {
  const result: any = {}
  for (const key in subject) {
    if (!keys.includes(key as unknown as Key)) {
      result[key] = subject[key]
    }
  }
  return result
}
