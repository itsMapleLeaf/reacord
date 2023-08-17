import { Node } from "../../internal/node.js"
import type { EmbedOptions } from "./embed-options"

export abstract class EmbedChildNode<Props> extends Node<Props> {
	abstract modifyEmbedOptions(options: EmbedOptions): void
}
