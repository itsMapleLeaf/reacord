import type {
  ButtonInteraction,
  CacheType,
  EmojiResolvable,
  MessageButtonStyle,
  MessageComponentInteraction,
  MessageOptions,
} from "discord.js"
import { MessageActionRow } from "discord.js"
import { nanoid } from "nanoid"
import React from "react"
import { last } from "../src/helpers/last.js"
import { toUpper } from "../src/helpers/to-upper.js"
import { Node } from "./node.js"

export type ButtonProps = {
  label?: string
  style?: Exclude<Lowercase<MessageButtonStyle>, "link">
  disabled?: boolean
  emoji?: EmojiResolvable
  onClick: (interaction: ButtonInteraction) => void
}

export function Button(props: ButtonProps) {
  return (
    <reacord-element props={props} createNode={() => new ButtonNode(props)} />
  )
}

class ButtonNode extends Node<ButtonProps> {
  private customId = nanoid()

  private get buttonOptions() {
    return {
      type: "BUTTON",
      customId: this.customId,
      style: toUpper(this.props.style ?? "secondary"),
      disabled: this.props.disabled,
      emoji: this.props.emoji,
      label: this.props.label,
    } as const
  }

  override modifyMessageOptions(options: MessageOptions): void {
    options.components ??= []

    let actionRow = last(options.components)

    if (
      !actionRow ||
      actionRow.components.length >= 5 ||
      actionRow.components[0]?.type === "SELECT_MENU"
    ) {
      actionRow = new MessageActionRow()
      options.components.push(actionRow)
    }

    if (actionRow instanceof MessageActionRow) {
      actionRow.addComponents(this.buttonOptions)
    } else {
      actionRow.components.push(this.buttonOptions)
    }
  }

  override handleInteraction(
    interaction: MessageComponentInteraction<CacheType>,
  ) {
    if (interaction.isButton() && interaction.customId === this.customId) {
      this.props.onClick(interaction)
      return true
    }
  }
}
