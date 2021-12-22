import { rejectAfter } from "./reject-after.js"
import type { MaybePromise } from "./types.js"
import { waitFor } from "./wait-for.js"

// eslint-disable-next-line import/no-unused-modules
export function waitForWithTimeout(
  condition: () => MaybePromise<boolean>,
  timeout = 1000,
  errorMessage = `timed out after ${timeout}ms`,
) {
  return Promise.race([waitFor(condition), rejectAfter(timeout, errorMessage)])
}
