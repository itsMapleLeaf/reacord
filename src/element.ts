import type { MessageOptions } from "discord.js"

export type ReacordElementJsxTag = "reacord-element"

export type ReacordElement = {
  modifyOptions: (options: MessageOptions) => void
}

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements
      extends Record<ReacordElementJsxTag, ReacordElement> {}
  }
}
