import type { TextProps } from "./components/text.jsx"

export type ReacordElementMap = {
  "reacord-text": TextProps
}

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements extends ReacordElementMap {}
  }
}
