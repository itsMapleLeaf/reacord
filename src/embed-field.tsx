import type { MessageEmbedOptions } from "discord.js"
import React from "react"
import { ContainerInstance } from "./container-instance.js"
import { pick } from "./helpers/pick.js"

export type EmbedFieldProps = {
  name: string
  children: React.ReactNode
  inline?: boolean
}

export function EmbedField(props: EmbedFieldProps) {
  return (
    <reacord-element createInstance={() => new EmbedFieldInstance(props)}>
      {props.children}
    </reacord-element>
  )
}

class EmbedFieldInstance extends ContainerInstance {
  readonly name = "EmbedField"

  constructor(private readonly props: EmbedFieldProps) {
    super({ warnOnNonTextChildren: true })
  }

  override renderToEmbed(options: MessageEmbedOptions) {
    options.fields ??= []
    options.fields.push({
      ...pick(this.props, "name", "inline"),
      value: this.getChildrenText(),
    })
  }
}
