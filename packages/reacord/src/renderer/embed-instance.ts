import type {
  ColorResolvable,
  MessageEmbedOptions,
  MessageOptions,
} from "discord.js"
import { ContainerInstance } from "./container-instance.js"

/** Represents an <Embed /> element */
export class EmbedInstance extends ContainerInstance {
  readonly name = "Embed"

  constructor(readonly color?: ColorResolvable) {
    super({ warnOnNonTextChildren: false })
  }

  override renderToMessage(message: MessageOptions) {
    message.embeds ??= []
    message.embeds.push(this.embedOptions)
  }

  get embedOptions(): MessageEmbedOptions {
    return {
      color: this.color,
      description: this.getChildrenText() || "_ _",
    }
  }
}
