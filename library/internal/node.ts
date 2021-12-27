/* eslint-disable class-methods-use-this */
import { Container } from "./container.js"
import type { ComponentInteraction } from "./interaction"
import type { MessageOptions } from "./message"

export abstract class Node<Props> {
  readonly children = new Container<Node<unknown>>()
  protected props: Props

  constructor(initialProps: Props) {
    this.props = initialProps
  }

  setProps(props: Props) {
    this.props = props
  }

  modifyMessageOptions(options: MessageOptions) {}

  handleComponentInteraction(interaction: ComponentInteraction): boolean {
    return false
  }
}
