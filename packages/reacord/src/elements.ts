import type { EmbedProps } from "./components/embed.js"
import type { TextProps } from "./components/text.jsx"

export type ReacordElementMap = {
  "reacord-text": TextProps
  "reacord-embed": EmbedProps
}

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements extends ReacordElementMap {}
  }
}
