import { randomUUID } from "node:crypto"
import React from "react"
import type { ButtonSharedProps } from "./button-shared-props"
import type { ComponentEvent } from "./component-event"
import { Node } from "./node"
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

export function Button({ label, children, ...props }: ButtonProps) {
  return (
    <ReacordElement
      name="button"
      createNode={() => new ButtonNode(props)}
      nodeProps={props}
    >
      {label ?? children}
    </ReacordElement>
  )
}

export class ButtonNode extends Node<ButtonProps> {
  readonly customId = randomUUID()
}
