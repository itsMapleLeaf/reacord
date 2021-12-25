import type { MessageEmbedOptions } from "discord.js"
import { Node } from "../node.js"

export abstract class EmbedChildNode<Props> extends Node<Props> {
  abstract modifyEmbedOptions(options: MessageEmbedOptions): void
}
