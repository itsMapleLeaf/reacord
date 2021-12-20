import type { MessageEmbedOptions } from "discord.js"
import type { ReactNode } from "react"
import React from "react"
import { ContainerInstance } from "./container-instance.js"

export type EmbedAuthorProps = {
  url?: string
  iconUrl?: string
  children?: ReactNode
}

export function EmbedAuthor({ children, ...options }: EmbedAuthorProps) {
  return (
    <reacord-element createInstance={() => new EmbedAuthorInstance(options)}>
      {children}
    </reacord-element>
  )
}

type EmbedAuthorOptions = Omit<EmbedAuthorProps, "children">

class EmbedAuthorInstance extends ContainerInstance {
  readonly name = "EmbedAuthor"

  constructor(private readonly props: EmbedAuthorOptions) {
    super({ warnOnNonTextChildren: true })
  }

  override renderToEmbed(options: MessageEmbedOptions) {
    options.author ??= {}
    options.author.name = this.getChildrenText()
    options.author.url = this.props.url
    options.author.iconURL = this.props.iconUrl
  }
}
