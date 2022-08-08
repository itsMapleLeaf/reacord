import type { ReactNode } from "react"
import React from "react"
import { Node } from "../node"
import { ReacordElement } from "./reacord-element"

/**
 * @category Embed
 */
export type EmbedFooterProps = {
  text?: ReactNode
  children?: ReactNode
  iconUrl?: string
  timestamp?: string | number | Date
}

/**
 * @category Embed
 */
export function EmbedFooter({ text, children, ...props }: EmbedFooterProps) {
  return (
    <ReacordElement props={props} createNode={() => new EmbedFooterNode(props)}>
      {text ?? children}
    </ReacordElement>
  )
}

export class EmbedFooterNode extends Node<
  Omit<EmbedFooterProps, "text" | "children">
> {}
