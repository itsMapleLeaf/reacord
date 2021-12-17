import type { ColorResolvable } from "discord.js"
import type { ReactNode } from "react"
import React from "react"

export type EmbedProps = {
  color?: ColorResolvable
  children?: ReactNode
}

export function Embed(props: EmbedProps) {
  return <reacord-embed {...props} />
}
