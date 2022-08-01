import type { APIMessageComponentButtonInteraction } from "discord.js"
import { randomUUID } from "node:crypto"
import type { ReactNode } from "react"
import React from "react"
import type { ComponentEvent } from "./component-event.js"
import { Node } from "./node.js"
import { ReacordElement } from "./reacord-element.js"

export type ButtonProps = {
  /** The text on the button. Rich formatting (markdown) is not supported here. */
  label?: ReactNode

  /** The text on the button. Rich formatting (markdown) is not supported here.
   * If both `label` and `children` are passed, `children` will be ignored.
   */
  children?: ReactNode

  /** When true, the button will be slightly faded, and cannot be clicked. */
  disabled?: boolean

  /**
   * Renders an emoji to the left of the text.
   * Has to be a literal emoji character (e.g. 🍍),
   * or an emoji code, like `<:plus_one:778531744860602388>`.
   *
   * To get an emoji code, type your emoji in Discord chat
   * with a backslash `\` in front.
   * The bot has to be in the emoji's guild to use it.
   */
  emoji?: string

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
  interaction: APIMessageComponentButtonInteraction
}

export function Button({ label, children, ...props }: ButtonProps) {
  return (
    <ReacordElement createNode={() => new ButtonNode(props)}>
      {label ?? children}
    </ReacordElement>
  )
}

export class ButtonNode extends Node<ButtonProps> {
  readonly customId = randomUUID()
}
