import type { MessageOptions } from "discord.js"
import { Node } from "./node.js"

export class TextNode extends Node<string> {
  override modifyMessageOptions(options: MessageOptions) {
    options.content = (options.content ?? "") + this.props
  }
}
