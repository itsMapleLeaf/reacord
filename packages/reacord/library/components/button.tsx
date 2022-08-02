import type { APIMessageComponentButtonInteraction } from "discord.js"
import { randomUUID } from "node:crypto"
import React from "react"
import type { ComponentEvent } from "../core/component-event.js"
import { ReacordElement } from "../internal/element.js"
import { Node } from "../node.js"
import type { ButtonSharedProps } from "./button-shared-props"

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
      <ReacordElement props={{}} createNode={() => new ButtonLabelNode({})}>
        {props.label}
      </ReacordElement>
    </ReacordElement>
  )
}

export class ButtonNode extends Node<ButtonProps> {
  readonly customId = randomUUID()

  // this has text children, but buttons themselves shouldn't yield text
  // eslint-disable-next-line class-methods-use-this
  // override get text() {
  //   return ""
  // }

  // override modifyMessageOptions(options: MessageOptions): void {
  //   getNextActionRow(options).push({
  //     type: "button",
  //     customId: this.customId,
  //     style: this.props.style ?? "secondary",
  //     disabled: this.props.disabled,
  //     emoji: this.props.emoji,
  //     label: this.children.findType(ButtonLabelNode)?.text,
  //   })
  // }

  // override handleComponentInteraction(interaction: ComponentInteraction) {
  //   if (
  //     interaction.type === "button" &&
  //     interaction.customId === this.customId
  //   ) {
  //     this.props.onClick(interaction.event)
  //     return true
  //   }
  //   return false
  // }
}

class ButtonLabelNode extends Node<{}> {}
