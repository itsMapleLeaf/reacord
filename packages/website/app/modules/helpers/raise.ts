export function raise(error: unknown): never {
  throw error instanceof Error ? error : new Error(String(error))
}
