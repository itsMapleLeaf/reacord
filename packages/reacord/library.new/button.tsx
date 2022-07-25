import { randomUUID } from "node:crypto"
import React from "react"
import type { ButtonSharedProps } from "./button-shared-props"
import type { ComponentEvent } from "./component-event"
import { Container } from "./container"
import type { Node, NodeContainer } from "./node"
import { TextNode } from "./node"
import { ReacordElement } from "./reacord-element"

/**
 * @category Button
 */
export type ButtonProps = ButtonSharedProps & {
  /**
   * The style determines the color of the button and signals intent.
   * @see https://discord.com/developers/docs/interactions/message-components#button-object-button-styles
   */
  style?: "primary" | "secondary" | "success" | "danger"

  /**
   * Happens when a user clicks the button.
   */
  onClick: (event: ButtonClickEvent) => void
}

/**
 * @category Button
 */
export type ButtonClickEvent = ComponentEvent

export function Button({ label, ...props }: ButtonProps) {
  return (
    <ReacordElement createNode={() => new ButtonNode(props)} nodeProps={props}>
      {label}
    </ReacordElement>
  )
}

export class ButtonNode implements Node<ButtonProps> {
  readonly children: NodeContainer = new Container()
  readonly customId = randomUUID()

  constructor(readonly props: ButtonProps) {}

  get label(): string {
    return this.children
      .getItems()
      .map((child) => (child instanceof TextNode ? child.props.text : ""))
      .join("")
  }
}
