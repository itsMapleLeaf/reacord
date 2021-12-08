import { rejectAfter } from "./reject-after.js"
import type { MaybePromise } from "./types.js"
import { waitFor } from "./wait-for.js"

export function waitForWithTimeout(
  condition: () => MaybePromise<boolean>,
  timeout = 1000,
) {
  return Promise.race([waitFor(condition), rejectAfter(timeout)])
}
