import type { MessageOptions } from "discord.js"

export class TextInstance {
  text: string

  constructor(text: string) {
    this.text = text
  }

  render(options: MessageOptions) {
    options.content = `${options.content ?? ""}${this.text}`
  }
}
