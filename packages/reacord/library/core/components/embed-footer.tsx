import React from "react"
import { ReacordElement } from "../../internal/element.js"
import { EmbedChildNode } from "./embed-child.js"
import type { EmbedOptions } from "./embed-options"

/**
 * @category Embed
 */
export type EmbedFooterProps = {
  text?: string
  children?: string
  iconUrl?: string
  timestamp?: string | number | Date
}

/**
 * @category Embed
 */
export function EmbedFooter(props: EmbedFooterProps) {
  return (
    <ReacordElement
      props={props}
      createNode={() => new EmbedFooterNode(props)}
    />
  )
}

class EmbedFooterNode extends EmbedChildNode<EmbedFooterProps> {
  override modifyEmbedOptions(options: EmbedOptions): void {
    options.footer = {
      text: this.props.text ?? this.props.children ?? "",
      icon_url: this.props.iconUrl,
    }
    options.timestamp = this.props.timestamp
      ? new Date(this.props.timestamp).toISOString()
      : undefined
  }
}
