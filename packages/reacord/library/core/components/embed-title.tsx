import React from "react"
import { ReacordElement } from "../../internal/element.js"
import { EmbedChildNode } from "./embed-child.js"
import type { EmbedOptions } from "./embed-options"

/**
 * @category Embed
 */
export type EmbedTitleProps = {
  children: string
  url?: string
}

/**
 * @category Embed
 */
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
