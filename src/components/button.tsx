import type { EmojiResolvable, MessageButtonStyle } from "discord.js"
import React from "react"

export type ButtonStyle = Exclude<Lowercase<MessageButtonStyle>, "link">

export type ButtonProps = {
  style?: ButtonStyle
  emoji?: EmojiResolvable
  disabled?: boolean
  children?: React.ReactNode
}

export function Button(props: ButtonProps) {
  return (
    <reacord-element
      createNode={() => ({ ...props, type: "button", children: [] })}
    >
      {props.children}
    </reacord-element>
  )
}
