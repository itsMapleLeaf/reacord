import type { ReactNode } from "react"
import React from "react"
import { ReacordElement } from "../../internal/element.js"
import { Node } from "../../internal/node.js"
import { EmbedChildNode } from "./embed-child.js"
import type { EmbedOptions } from "./embed-options"

/**
 * @category Embed
 */
export type EmbedAuthorProps = {
  name?: ReactNode
  children?: ReactNode
  url?: string
  iconUrl?: string
}

/**
 * @category Embed
 */
export function EmbedAuthor(props: EmbedAuthorProps) {
  return (
    <ReacordElement props={props} createNode={() => new EmbedAuthorNode(props)}>
      <ReacordElement props={{}} createNode={() => new AuthorTextNode({})}>
        {props.name ?? props.children}
      </ReacordElement>
    </ReacordElement>
  )
}

class EmbedAuthorNode extends EmbedChildNode<EmbedAuthorProps> {
  override modifyEmbedOptions(options: EmbedOptions): void {
    options.author = {
      name: this.children.findType(AuthorTextNode)?.text ?? "",
      url: this.props.url,
      icon_url: this.props.iconUrl,
    }
  }
}

class AuthorTextNode extends Node<{}> {}
