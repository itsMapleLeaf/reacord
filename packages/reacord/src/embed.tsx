import type {
  ColorResolvable,
  MessageEmbedOptions,
  MessageOptions,
} from "discord.js"
import type { ReactNode } from "react"
import React from "react"
import { ContainerInstance } from "./container-instance.js"

export type EmbedProps = {
  color?: ColorResolvable
  children?: ReactNode
}

export function Embed(props: EmbedProps) {
  return (
    <reacord-element createInstance={() => new EmbedInstance(props.color)}>
      {props.children}
    </reacord-element>
  )
}

class EmbedInstance extends ContainerInstance {
  readonly name = "Embed"

  constructor(readonly color?: ColorResolvable) {
    super({ warnOnNonTextChildren: false })
  }

  override renderToMessage(message: MessageOptions) {
    message.embeds ??= []
    message.embeds.push(this.embedOptions)
  }

  get embedOptions(): MessageEmbedOptions {
    return {
      color: this.color,
      description: this.getChildrenText() || "_ _",
    }
  }
}
