import React from "react"
import type { CamelCasedPropertiesDeep } from "type-fest"
import { snakeCaseDeep } from "../../helpers/convert-object-property-case"
import { omit } from "../../helpers/omit"
import { ReacordElement } from "../element.js"
import type { MessageOptions } from "../message"
import { Node } from "../node.js"
import { EmbedChildNode } from "./embed-child.js"
import type { EmbedOptions } from "./embed-options"

export type EmbedProps = Omit<
  CamelCasedPropertiesDeep<EmbedOptions>,
  "timestamp"
> & {
  timestamp?: string | number | Date
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
    const embed: EmbedOptions = {
      ...snakeCaseDeep(omit(this.props, ["children", "timestamp"])),
      timestamp: this.props.timestamp
        ? new Date(this.props.timestamp).toISOString()
        : undefined,
    }

    for (const child of this.children) {
      if (child instanceof EmbedChildNode) {
        child.modifyEmbedOptions(embed)
      }
    }

    options.embeds.push(embed)
  }
}
