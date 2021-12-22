import type { ColorResolvable } from "discord.js"
import type { ReactNode } from "react"
import React from "react"

export type EmbedProps = {
  title?: string
  color?: ColorResolvable
  url?: string
  timestamp?: Date | number | string
  imageUrl?: string
  thumbnailUrl?: string
  author?: {
    name: string
    url?: string
    iconUrl?: string
  }
  footer?: {
    text: string
    iconUrl?: string
  }
  children?: ReactNode
}

export function Embed(props: EmbedProps) {
  return (
    <reacord-element
      createNode={() => ({ ...props, type: "embed", children: [] })}
    >
      {props.children}
    </reacord-element>
  )
}
