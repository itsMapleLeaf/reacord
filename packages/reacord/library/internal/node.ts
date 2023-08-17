import { Container } from "./container.js"
import type { ComponentInteraction } from "./interaction"
import type { MessageOptions } from "./message"

export abstract class Node<Props> {
	readonly children = new Container<Node<unknown>>()

	constructor(public props: Props) {}

	modifyMessageOptions(_options: MessageOptions) {
		// noop
	}

	handleComponentInteraction(_interaction: ComponentInteraction): boolean {
		return false
	}

	get text(): string {
		return [...this.children].map((child) => child.text).join("")
	}
}
