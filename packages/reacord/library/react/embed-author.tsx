import type { ReactNode } from "react"
import React from "react"
import { Node } from "../node.js"
import { ReacordElement } from "./reacord-element.js"

/**
 * @category Embed
 */
export type EmbedAuthorProps = {
  name?: ReactNode
  children?: ReactNode
  url?: string
  iconUrl?: string
}

/**
 * @category Embed
 */
export function EmbedAuthor(props: EmbedAuthorProps) {
  return (
    <ReacordElement props={props} createNode={() => new EmbedAuthorNode(props)}>
      {props.name ?? props.children}
    </ReacordElement>
  )
}

export class EmbedAuthorNode extends Node<EmbedAuthorProps> {}
