import type { ReactNode } from "react"
import type { Node } from "./node.js"

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements {
      "reacord-element": {
        props: Record<string, unknown>
        createNode: (props: Record<string, unknown>) => Node
        children?: ReactNode
      }
    }
  }
}
