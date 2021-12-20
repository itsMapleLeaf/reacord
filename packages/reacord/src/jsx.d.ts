declare namespace JSX {
  import type { ReactNode } from "react"

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface IntrinsicElements {
    "reacord-element": {
      createInstance: () => unknown
      children?: ReactNode
    }
  }
}
