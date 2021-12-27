import { nanoid } from "nanoid"
import React from "react"
import { ReacordElement } from "../../internal/element.js"
import type { ComponentInteraction } from "../../internal/interaction"
import type { MessageOptions } from "../../internal/message"
import { getNextActionRow } from "../../internal/message"
import { Node } from "../../internal/node.js"

export type ButtonProps = {
  label?: string
  style?: "primary" | "secondary" | "success" | "danger"
  disabled?: boolean
  emoji?: string
  onClick: (event: ButtonClickEvent) => void
}

export type ButtonClickEvent = {}

export function Button(props: ButtonProps) {
  return (
    <ReacordElement props={props} createNode={() => new ButtonNode(props)} />
  )
}

class ButtonNode extends Node<ButtonProps> {
  private customId = nanoid()

  override modifyMessageOptions(options: MessageOptions): void {
    getNextActionRow(options).push({
      type: "button",
      customId: this.customId,
      style: this.props.style ?? "secondary",
      disabled: this.props.disabled,
      emoji: this.props.emoji,
      label: this.props.label,
    })
  }

  override handleComponentInteraction(interaction: ComponentInteraction) {
    if (
      interaction.type === "button" &&
      interaction.customId === this.customId
    ) {
      this.props.onClick(interaction)
      return true
    }
    return false
  }
}
