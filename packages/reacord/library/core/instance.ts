import type { ReactNode } from "react"

/**
 * @category Core
 */
export type ReacordInstance = {
  render: (content: ReactNode) => void
  deactivate: () => void
  destroy: () => void
}
