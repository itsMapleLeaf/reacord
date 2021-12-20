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
    /* eslint-disable unicorn/no-null */
    const options: MessageEmbedOptions = {
      color: this.color,
      description: null as unknown as undefined,
    }
    /* eslint-enable unicorn/no-null */

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
