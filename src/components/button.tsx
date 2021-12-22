import type {
  ButtonInteraction,
  EmojiResolvable,
  MessageButtonStyle,
} from "discord.js"
import { nanoid } from "nanoid"
import React from "react"

export type ButtonStyle = Exclude<Lowercase<MessageButtonStyle>, "link">

export type ButtonProps = {
  style?: ButtonStyle
  emoji?: EmojiResolvable
  disabled?: boolean
  onClick: (interaction: ButtonInteraction) => void
  children?: React.ReactNode
}

export function Button(props: ButtonProps) {
  return (
    <reacord-element
      createNode={() => ({
        ...props,
        type: "button",
        children: [],
        customId: nanoid(),
      })}
    >
      {props.children}
    </reacord-element>
  )
}
