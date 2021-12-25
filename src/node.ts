/* eslint-disable class-methods-use-this */
import type { MessageComponentInteraction, MessageOptions } from "discord.js"
import { Container } from "./container.js"

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

  handleInteraction(
    interaction: MessageComponentInteraction,
  ): true | undefined {
    return undefined
  }
}
