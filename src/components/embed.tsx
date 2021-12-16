import type { ColorResolvable } from "discord.js"
import type { ReactNode } from "react"
import * as React from "react"

export type EmbedProps = {
  color?: ColorResolvable
  children?: ReactNode
}

export function Embed(props: EmbedProps) {
  return (
    <reacord-element
      modifyOptions={(options) => {
        options.embeds ??= []
        options.embeds.push({ color: props.color })
      }}
    />
  )
}
