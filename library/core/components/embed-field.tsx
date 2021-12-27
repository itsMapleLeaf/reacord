import React from "react"
import { ReacordElement } from "../../internal/element.js"
import { EmbedChildNode } from "./embed-child.js"
import type { EmbedOptions } from "./embed-options"

export type EmbedFieldProps = {
  name: string
  value?: string
  inline?: boolean
  children?: string
}

export function EmbedField(props: EmbedFieldProps) {
  return (
    <ReacordElement
      props={props}
      createNode={() => new EmbedFieldNode(props)}
    />
  )
}

class EmbedFieldNode extends EmbedChildNode<EmbedFieldProps> {
  override modifyEmbedOptions(options: EmbedOptions): void {
    options.fields ??= []
    options.fields.push({
      name: this.props.name,
      value: this.props.value ?? this.props.children ?? "",
      inline: this.props.inline,
    })
  }
}
