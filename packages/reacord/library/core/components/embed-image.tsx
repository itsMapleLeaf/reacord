import React from "react"
import { ReacordElement } from "../../internal/element.js"
import { EmbedChildNode } from "./embed-child.js"
import type { EmbedOptions } from "./embed-options"

export type EmbedImageProps = {
  url: string
}

export function EmbedImage(props: EmbedImageProps) {
  return (
    <ReacordElement
      props={props}
      createNode={() => new EmbedImageNode(props)}
    />
  )
}

class EmbedImageNode extends EmbedChildNode<EmbedImageProps> {
  override modifyEmbedOptions(options: EmbedOptions): void {
    options.image = { url: this.props.url }
  }
}
