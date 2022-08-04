import React from "react"
import { Node } from "../node"
import { ReacordElement } from "../reacord-element.js"

/**
 * @category Embed
 */
export type EmbedImageProps = {
  url: string
}

/**
 * @category Embed
 */
export function EmbedImage(props: EmbedImageProps) {
  return (
    <ReacordElement
      props={props}
      createNode={() => new EmbedImageNode(props)}
    />
  )
}

export class EmbedImageNode extends Node<EmbedImageProps> {}
