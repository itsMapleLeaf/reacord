import type { MessageOptions } from "discord.js"
import React from "react"
import { Node } from "./node.js"

export type EmbedProps = {
  title?: string
  description?: string
  url?: string
  timestamp?: Date
  color?: number
  footer?: {
    text: string
    iconURL?: string
  }
  image?: {
    url: string
  }
  thumbnail?: {
    url: string
  }
  author?: {
    name: string
    url?: string
    iconURL?: string
  }
  fields?: Array<{
    name: string
    value: string
    inline?: boolean
  }>
}

export function Embed(props: EmbedProps) {
  return (
    <reacord-element props={props} createNode={() => new EmbedNode(props)} />
  )
}

class EmbedNode extends Node<EmbedProps> {
  override modifyMessageOptions(options: MessageOptions): void {
    options.embeds ??= []
    options.embeds.push(this.props)
  }
}
