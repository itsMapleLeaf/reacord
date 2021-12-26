import React from "react"
import { ReacordElement } from "../element.js"
import { EmbedChildNode } from "./embed-child.js"
import type { EmbedOptions } from "./embed-options"

export type EmbedThumbnailProps = {
  url: string
}

export function EmbedThumbnail(props: EmbedThumbnailProps) {
  return (
    <ReacordElement
      props={props}
      createNode={() => new EmbedThumbnailNode(props)}
    />
  )
}

class EmbedThumbnailNode extends EmbedChildNode<EmbedThumbnailProps> {
  override modifyEmbedOptions(options: EmbedOptions): void {
    options.thumbnail = { url: this.props.url }
  }
}
