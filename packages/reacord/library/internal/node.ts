/* eslint-disable class-methods-use-this */
import { Container } from "./container.js"
import type { ComponentInteraction } from "./interaction"
import type { MessageOptions } from "./message"

export abstract class Node<Props> {
  readonly children = new Container<Node<unknown>>()

  constructor(public props: Props) {}

  modifyMessageOptions(options: MessageOptions) {}

  handleComponentInteraction(interaction: ComponentInteraction): boolean {
    return false
  }

  get text(): string {
    return [...this.children].map((child) => child.text).join("")
  }
}
