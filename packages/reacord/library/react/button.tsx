import type { APIMessageComponentButtonInteraction } from "discord.js"
import { randomUUID } from "node:crypto"
import React from "react"
import { Node } from "../node.js"
import type { ButtonSharedProps } from "./button-shared-props"
import type { ComponentEvent } from "./component-event.js"
import { ReacordElement } from "./reacord-element.js"

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
export type ButtonClickEvent = ComponentEvent & {
  /**
   * Event details, e.g. the user who clicked, guild member, guild id, etc.
   * @see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
   */
  interaction: APIMessageComponentButtonInteraction
}

/**
 * @category Button
 */
export function Button(props: ButtonProps) {
  return (
    <ReacordElement props={props} createNode={() => new ButtonNode(props)}>
      {props.label}
    </ReacordElement>
  )
}

export class ButtonNode extends Node<ButtonProps> {
  readonly customId = randomUUID()
}
