import type { ReactNode } from "react"
import React from "react"
import { ReacordElement } from "../internal/element.js"
import { Node } from "../internal/node.js"
import { EmbedChildNode } from "./embed-child.js"
import type { EmbedOptions } from "./embed-options"

/**
 * @category Embed
 */
export type EmbedFieldProps = {
  name: ReactNode
  value?: ReactNode
  inline?: boolean
  children?: ReactNode
}

/**
 * @category Embed
 */
export function EmbedField(props: EmbedFieldProps) {
  return (
    <ReacordElement props={props} createNode={() => new EmbedFieldNode(props)}>
      <ReacordElement props={{}} createNode={() => new FieldNameNode({})}>
        {props.name}
      </ReacordElement>
      <ReacordElement props={{}} createNode={() => new FieldValueNode({})}>
        {props.value || props.children}
      </ReacordElement>
    </ReacordElement>
  )
}

class EmbedFieldNode extends EmbedChildNode<EmbedFieldProps> {
  override modifyEmbedOptions(options: EmbedOptions): void {
    options.fields ??= []
    options.fields.push({
      name: this.children.findType(FieldNameNode)?.text ?? "",
      value: this.children.findType(FieldValueNode)?.text ?? "",
      inline: this.props.inline,
    })
  }
}

class FieldNameNode extends Node<{}> {}
class FieldValueNode extends Node<{}> {}
