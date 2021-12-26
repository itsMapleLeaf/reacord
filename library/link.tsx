import React from "react"
import { last } from "../helpers/last.js"
import { ReacordElement } from "./element.js"
import type { MessageOptions } from "./message"
import { Node } from "./node.js"

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
    let actionRow = last(options.actionRows)

    if (
      actionRow == undefined ||
      actionRow.length >= 5 ||
      actionRow[0]?.type === "select"
    ) {
      actionRow = []
      options.actionRows.push(actionRow)
    }

    actionRow.push({
      type: "link",
      disabled: this.props.disabled,
      emoji: this.props.emoji,
      label: this.props.label || this.props.children,
      url: this.props.url,
    })
  }
}
