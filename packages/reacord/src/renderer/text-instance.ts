import type { MessageOptions } from "discord.js"

export class TextInstance {
  constructor(readonly text: string) {}

  renderToMessage(options: MessageOptions) {
    options.content = `${options.content ?? ""}${this.text}`
  }
}
