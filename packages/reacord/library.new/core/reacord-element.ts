import type { ReactNode } from "react"
import { createElement } from "react"
import { inspect } from "node:util"
import type { Node } from "./node"

export function ReacordElement<NodeProps = unknown>({
  name,
  createNode,
  nodeProps,
  children,
}: {
  // A name representing what type of element this is,
  // so that react will know if/when it needs to recreate the node,
  // or just assign the props if the element name is the same on re-render
  name: string
  createNode: () => Node<NodeProps>
  nodeProps: NodeProps
  children?: ReactNode
}) {
  return createElement<ReacordHostElementProps>(
    `reacord-${name}`,
    { config: new ReacordElementConfig(createNode, nodeProps) },
    children,
  )
}

export type ReacordHostElementProps = {
  config: ReacordElementConfig<unknown>
}

// Any kind of element can go through the React reconciler.
// This class serves as a typesafe wrapper for creating a node
// and assigning props to an existing node.
// We can use `instanceof` to know for sure that the element is a Reacord element
export class ReacordElementConfig<Props> {
  constructor(readonly create: () => Node<Props>, readonly props: Props) {}

  static parse(value: unknown): ReacordElementConfig<unknown> {
    if (value instanceof ReacordElementConfig) return value
    const debugValue = inspect(value, { depth: 1 })
    throw new Error(`Expected ${ReacordElementConfig.name}, got ${debugValue}`)
  }
}
