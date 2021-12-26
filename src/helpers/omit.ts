import type { Except } from "type-fest"

// eslint-disable-next-line import/no-unused-modules
export function omit<Subject extends object, Key extends keyof Subject>(
  subject: Subject,
  keys: Key[],
): Except<Subject, Key> {
  const result: any = {}
  for (const key in subject) {
    if (!keys.includes(key as unknown as Key)) {
      result[key] = subject[key]
    }
  }
  return result
}
