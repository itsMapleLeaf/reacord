import type { ReactNode } from "react"
import React from "react"
import { ReacordElement } from "../../internal/element.js"
import type { MessageOptions } from "../../internal/message"
import { Node } from "../../internal/node.js"

export type ActionRowProps = {
  children?: ReactNode
}

export function ActionRow(props: ActionRowProps) {
  return (
    <ReacordElement props={props} createNode={() => new ActionRowNode(props)}>
      {props.children}
    </ReacordElement>
  )
}

class ActionRowNode extends Node<{}> {
  override modifyMessageOptions(options: MessageOptions): void {
    options.actionRows.push([])
    for (const child of this.children) {
      child.modifyMessageOptions(options)
    }
  }
}
