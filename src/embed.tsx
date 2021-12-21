import type {
  ColorResolvable,
  MessageEmbedOptions,
  MessageOptions,
} from "discord.js"
import type { ReactNode } from "react"
import React from "react"
import { ContainerInstance } from "./container-instance.js"

export type EmbedProps = {
  title?: string
  color?: ColorResolvable
  url?: string
  timestamp?: Date | number | string
  imageUrl?: string
  thumbnailUrl?: string
  author?: {
    name?: string
    url?: string
    iconUrl?: string
  }
  footer?: {
    text?: string
    iconUrl?: string
  }
  children?: ReactNode
}

export function Embed(props: EmbedProps) {
  return (
    <reacord-element createInstance={() => new EmbedInstance(props)}>
      {props.children}
    </reacord-element>
  )
}

class EmbedInstance extends ContainerInstance {
  readonly name = "Embed"

  constructor(readonly props: EmbedProps) {
    super({ warnOnNonTextChildren: false })
  }

  override renderToMessage(message: MessageOptions) {
    message.embeds ??= []
    message.embeds.push(this.getEmbedOptions())
  }

  getEmbedOptions(): MessageEmbedOptions {
    const options: MessageEmbedOptions = {
      ...this.props,
      image: this.props.imageUrl ? { url: this.props.imageUrl } : undefined,
      thumbnail: this.props.thumbnailUrl
        ? { url: this.props.thumbnailUrl }
        : undefined,
      author: {
        ...this.props.author,
        iconURL: this.props.author?.iconUrl,
      },
      footer: {
        text: "",
        ...this.props.footer,
        iconURL: this.props.footer?.iconUrl,
      },
      timestamp: this.props.timestamp
        ? new Date(this.props.timestamp) // this _may_ need date-fns to parse this
        : undefined,
    }

    for (const child of this.children) {
      if (!child.renderToEmbed) {
        console.warn(`${child.name} is not a valid child of ${this.name}`)
        continue
      }
      child.renderToEmbed(options)
    }

    // can't render an empty embed
    if (!options.description) {
      options.description = "_ _"
    }

    return options
  }
}
