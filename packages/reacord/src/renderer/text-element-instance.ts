import type { MessageOptions } from "discord.js"
import { ContainerInstance } from "./container-instance.js"

/** Represents a <Text /> element */
export class TextElementInstance extends ContainerInstance {
  readonly name = "Text"

  constructor() {
    super({ warnOnNonTextChildren: true })
  }

  override getText() {
    return this.getChildrenText()
  }

  override renderToMessage(options: MessageOptions) {
    options.content = (options.content ?? "") + this.getText()
  }
}
