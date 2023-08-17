import { toError } from "./to-error.js"

export function raise(error: unknown): never {
	throw toError(error)
}
