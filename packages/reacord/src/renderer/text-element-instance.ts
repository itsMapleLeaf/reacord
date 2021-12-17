import type { MessageOptions } from "discord.js"
import type { TextInstance } from "./text-instance.js"

type TextElementChild = TextElementInstance | TextInstance

export class TextElementInstance {
  children = new Set<TextElementChild>()

  add(child: TextElementChild) {
    this.children.add(child)
  }

  renderToMessage(options: MessageOptions) {
    for (const child of this.children) {
      options.content = `${options.content ?? ""}${child.text}`
    }
  }

  get text(): string {
    return [...this.children].map((child) => child.text).join("")
  }
}
