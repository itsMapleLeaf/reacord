import type { MessageEmbedOptions, MessageOptions } from "discord.js"
import { BaseInstance } from "./base-instance.js"

/** Represents raw strings in JSX */
export class TextInstance extends BaseInstance {
  readonly name = "Text"

  constructor(private readonly text: string) {
    super()
  }

  override getText() {
    return this.text
  }

  override renderToMessage(options: MessageOptions) {
    options.content = (options.content ?? "") + this.getText()
  }

  override renderToEmbed(options: MessageEmbedOptions) {
    options.description = (options.description ?? "") + this.getText()
  }
}
