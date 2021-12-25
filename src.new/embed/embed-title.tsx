import { MessageEmbedOptions } from "discord.js"
import React from "react"
import { ReacordElement } from "../element.jsx"
import { EmbedChildNode } from "./embed-child.js"

export type EmbedTitleProps = {
  children: string
  url?: string
}

export function EmbedTitle(props: EmbedTitleProps) {
  return (
    <ReacordElement
      props={props}
      createNode={() => new EmbedTitleNode(props)}
    />
  )
}

class EmbedTitleNode extends EmbedChildNode<EmbedTitleProps> {
  override modifyEmbedOptions(options: MessageEmbedOptions): void {
    options.title = this.props.children
    options.url = this.props.url
  }
}
