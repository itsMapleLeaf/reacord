import React from "react"
import { Node } from "../node"
import { ReacordElement } from "../reacord-element.js"

/**
 * @category Embed
 */
export type EmbedThumbnailProps = {
  url: string
}

/**
 * @category Embed
 */
export function EmbedThumbnail(props: EmbedThumbnailProps) {
  return (
    <ReacordElement
      props={props}
      createNode={() => new EmbedThumbnailNode(props)}
    />
  )
}

export class EmbedThumbnailNode extends Node<EmbedThumbnailProps> {}
