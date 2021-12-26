import type { EmbedOptions } from "./embed/embed-options"

export type MessageOptions = {
  content: string
  embeds: EmbedOptions[]
  actionRows: Array<
    Array<
      | {
          type: "button"
          customId: string
          label?: string
          style?: "primary" | "secondary" | "success" | "danger"
          disabled?: boolean
          emoji?: string
        }
      | {
          type: "select"
          customId: string
          // todo
        }
    >
  >
}

export type Message = {
  edit(options: MessageOptions): Promise<void>
  disableComponents(): Promise<void>
}
