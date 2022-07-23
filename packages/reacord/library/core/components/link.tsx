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
export function Link({ label, children, ...props }: LinkProps) {
  return (
    <ReacordElement props={props} createNode={() => new LinkNode(props)}>
      <ReacordElement props={{}} createNode={() => new LinkTextNode({})}>
        {label || children}
      </ReacordElement>
    </ReacordElement>
  )
}

class LinkNode extends Node<Omit<LinkProps, "label" | "children">> {
  override modifyMessageOptions(options: MessageOptions): void {
    getNextActionRow(options).push({
      type: "link",
      disabled: this.props.disabled,
      emoji: this.props.emoji,
      label: this.children.findType(LinkTextNode)?.text,
      url: this.props.url,
    })
  }
}

class LinkTextNode extends Node<{}> {}
