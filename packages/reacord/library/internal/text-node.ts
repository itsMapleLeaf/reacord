import type { MessageOptions } from "./message"
import { Node } from "./node.js"

export class TextNode extends Node<string> {
	override modifyMessageOptions(options: MessageOptions) {
		options.content = options.content + this.props
	}

	override get text() {
		return this.props
	}
}
