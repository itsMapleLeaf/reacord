import type { MessageOptions } from "discord.js"
import type { TextInstance } from "./text-instance.js"

type TextElementInstanceChild = TextElementInstance | TextInstance

export class TextElementInstance {
  children = new Set<TextElementInstanceChild>()

  add(child: TextElementInstanceChild) {
    this.children.add(child)
  }

  remove(child: TextElementInstanceChild) {
    this.children.delete(child)
  }

  clear() {
    this.children.clear()
  }

  render(options: MessageOptions) {
    for (const child of this.children) {
      child.render(options)
    }
  }
}
