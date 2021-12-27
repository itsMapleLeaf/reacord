import React from "react"
import { ReacordElement } from "../../internal/element.js"
import type { MessageOptions } from "../../internal/message"
import { getNextActionRow } from "../../internal/message"
import { Node } from "../../internal/node.js"

export type LinkProps = {
  label?: string
  children?: string
  emoji?: string
  disabled?: boolean
  url: string
}

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
