import type { ReactNode } from "react"
import type { Node } from "./node-tree"

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements {
      "reacord-element": {
        createNode: () => Node
        children?: ReactNode
      }
    }
  }
}
