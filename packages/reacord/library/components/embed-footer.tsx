import type { ReactNode } from "react"
import React from "react"
import { Node } from "../node.js"
import { ReacordElement } from "../reacord-element.js"

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
> {
  // override modifyEmbedOptions(options: EmbedOptions): void {
  //   options.footer = {
  //     text: this.children.findType(FooterTextNode)?.text ?? "",
  //     icon_url: this.props.iconUrl,
  //   }
  //   options.timestamp = this.props.timestamp
  //     ? new Date(this.props.timestamp).toISOString()
  //     : undefined
  // }
}
