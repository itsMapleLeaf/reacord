import type { ReactNode } from "react"
import React from "react"
import { ReacordElement } from "../internal/element.js"
import { Node } from "../internal/node.js"
import { EmbedChildNode } from "./embed-child.js"
import type { EmbedOptions } from "./embed-options"

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
      <ReacordElement props={{}} createNode={() => new FooterTextNode({})}>
        {text ?? children}
      </ReacordElement>
    </ReacordElement>
  )
}

class EmbedFooterNode extends EmbedChildNode<
  Omit<EmbedFooterProps, "text" | "children">
> {
  override modifyEmbedOptions(options: EmbedOptions): void {
    options.footer = {
      text: this.children.findType(FooterTextNode)?.text ?? "",
      icon_url: this.props.iconUrl,
    }
    options.timestamp = this.props.timestamp
      ? new Date(this.props.timestamp).toISOString()
      : undefined
  }
}

class FooterTextNode extends Node<{}> {}
