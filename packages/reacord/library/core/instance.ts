import type { ReactNode } from "react"

export type ReacordInstance = {
  render: (content: ReactNode) => void
  deactivate: () => void
  destroy: () => void
}
