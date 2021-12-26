import React from "react"
import { ReacordElement } from "../element.js"
import { EmbedChildNode } from "./embed-child.js"
import type { EmbedOptions } from "./embed-options"

export type EmbedTitleProps = {
  children: string
  url?: string
}

export function EmbedTitle(props: EmbedTitleProps) {
  return (
    <ReacordElement
      props={props}
      createNode={() => new EmbedTitleNode(props)}
    />
  )
}

class EmbedTitleNode extends EmbedChildNode<EmbedTitleProps> {
  override modifyEmbedOptions(options: EmbedOptions): void {
    options.title = this.props.children
    options.url = this.props.url
  }
}
