import type { ButtonNode } from "./button"
import { Container } from "../../helpers/container"

export type NodeBase<Type extends string, Props> = {
  type: Type
  props: Props
  children: Container<Node>
}

export type Node = TextNode | ButtonNode | ActionRowNode

export type TextNode = NodeBase<"text", { text: string }>

export type ActionRowNode = NodeBase<"actionRow", {}>

export const makeNode = <Type extends Node["type"]>(
  type: Type,
  props: Extract<Node, { type: Type }>["props"],
) =>
  ({ type, props, children: new Container() } as Extract<Node, { type: Type }>)

/** A wrapper for ensuring we're actually working with a real node
 * inside the React reconciler
 */
export class NodeRef {
  constructor(public readonly node: Node) {}

  static unwrap(maybeNodeRef: unknown): Node {
    if (maybeNodeRef instanceof NodeRef) {
      return maybeNodeRef.node
    }
    const received = maybeNodeRef as Object | null | undefined
    throw new TypeError(
      `Expected ${NodeRef.name}, received instance of "${received?.constructor.name}"`,
    )
  }
}
