import type { MessageEmbedOptions, MessageOptions } from "discord.js"
import React from "react"
import { ReacordElement } from "./element.js"
import { Node } from "./node.js"

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

abstract class EmbedChildNode<Props> extends Node<Props> {
  abstract modifyEmbedOptions(options: MessageEmbedOptions): void
}

export type EmbedTitleProps = {
  children: string
  url?: string
}

Embed.Title = function Title(props: EmbedTitleProps) {
  return (
    <ReacordElement
      props={props}
      createNode={() => new EmbedTitleNode(props)}
    />
  )
}

class EmbedTitleNode extends EmbedChildNode<EmbedTitleProps> {
  override modifyEmbedOptions(options: MessageEmbedOptions): void {
    options.title = this.props.children
    options.url = this.props.url
  }
}

export type EmbedFieldProps = {
  name: string
  inline?: boolean
  children: string
}

Embed.Field = function Field(props: EmbedFieldProps) {
  return (
    <ReacordElement
      props={props}
      createNode={() => new EmbedFieldNode(props)}
    />
  )
}

class EmbedFieldNode extends EmbedChildNode<EmbedFieldProps> {
  override modifyEmbedOptions(options: MessageEmbedOptions): void {
    options.fields ??= []
    options.fields.push({
      name: this.props.name,
      value: this.props.children,
      inline: this.props.inline,
    })
  }
}
