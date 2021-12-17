import type {
  ColorResolvable,
  MessageEmbedOptions,
  MessageOptions,
} from "discord.js"
import type { TextElementInstance } from "./text-element-instance.js"
import type { TextInstance } from "./text-instance.js"

type EmbedChild = TextInstance | TextElementInstance

export class EmbedInstance {
  children: EmbedChild[] = []

  constructor(readonly color: ColorResolvable) {}

  add(child: EmbedChild) {
    this.children.push(child)
  }

  renderToMessage(message: MessageOptions) {
    message.embeds ??= []
    message.embeds.push(this.embedOptions)
  }

  get embedOptions(): MessageEmbedOptions {
    return {
      color: this.color,
      description: this.children.map((child) => child.text).join("") || "_ _",
    }
  }
}
