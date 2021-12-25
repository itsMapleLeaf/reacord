import type {
  EmojiResolvable,
  MessageButtonStyle,
  MessageComponentInteraction,
} from "discord.js"
import React from "react"
import { Node } from "../node.js"

export type ButtonProps = {
  label?: string
  style?: Exclude<Lowercase<MessageButtonStyle>, "link">
  disabled?: boolean
  emoji?: EmojiResolvable
  onClick?: (interaction: MessageComponentInteraction) => void
}

export const ButtonTag = "reacord-button"

export function Button(props: ButtonProps) {
  return React.createElement(ButtonTag, props)
}

export class ButtonNode extends Node {
  readonly name = "button"
  constructor(public props: ButtonProps) {
    super()
  }
}
