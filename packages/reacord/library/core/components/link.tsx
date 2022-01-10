import React from "react"
import { ReacordElement } from "../../internal/element.js"
import type { MessageOptions } from "../../internal/message"
import { getNextActionRow } from "../../internal/message"
import { Node } from "../../internal/node.js"
import type { ButtonSharedProps } from "./button-shared-props"

/**
 * @category Link
 */
export type LinkProps = ButtonSharedProps & {
  /** The URL the link should lead to */
  url: string
  /** The link text */
  children?: string
}

/**
 * @category Link
 */
export function Link(props: LinkProps) {
  return <ReacordElement props={props} createNode={() => new LinkNode(props)} />
}

class LinkNode extends Node<LinkProps> {
  override modifyMessageOptions(options: MessageOptions): void {
    getNextActionRow(options).push({
      type: "link",
      disabled: this.props.disabled,
      emoji: this.props.emoji,
      label: this.props.label || this.props.children,
      url: this.props.url,
    })
  }
}
