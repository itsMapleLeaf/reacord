import type { MessageOptions } from "discord.js"

export abstract class BaseInstance {
  /** The name of the JSX element represented by this instance */
  abstract readonly name: string

  /** If the element represents text, the text for this element */
  getText?(): string

  /** If this element can be a child of a message,
   * the function to modify the message options */
  renderToMessage?(options: MessageOptions): void
}
