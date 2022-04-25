export function omit<Subject extends object, Key extends PropertyKey>(
  subject: Subject,
  keys: Key[],
  // hack: using a conditional type preserves union types
): Subject extends any ? Omit<Subject, Key> : never {
  const result: any = {}
  for (const key in subject) {
    if (!keys.includes(key as unknown as Key)) {
      result[key] = subject[key]
    }
  }
  return result
}
