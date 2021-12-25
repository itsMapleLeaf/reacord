import type { MessageOptions } from "discord.js"
import React from "react"
import { ReacordElement } from "../element.js"
import { Node } from "../node.js"
import { EmbedChildNode } from "./embed-child.js"

export type EmbedProps = {
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
  children?: React.ReactNode
}

export function Embed(props: EmbedProps) {
  return (
    <ReacordElement props={props} createNode={() => new EmbedNode(props)}>
      {props.children}
    </ReacordElement>
  )
}

class EmbedNode extends Node<EmbedProps> {
  override modifyMessageOptions(options: MessageOptions): void {
    const embed = { ...this.props }
    for (const child of this.children) {
      if (child instanceof EmbedChildNode) {
        child.modifyEmbedOptions(embed)
      }
    }

    options.embeds ??= []
    options.embeds.push(embed)
  }
}
