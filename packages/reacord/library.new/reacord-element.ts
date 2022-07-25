import type { ReactNode } from "react"
import React from "react"
import type { Node } from "./node"
import { NodeDefinition } from "./node"

export function ReacordElement<Props>({
  children,
  createNode,
  nodeProps,
}: {
  createNode: () => Node<Props>
  nodeProps: Props
  children?: ReactNode
}) {
  return React.createElement(
    "reacord-element",
    { definition: new NodeDefinition(createNode, nodeProps) },
    children,
  )
}
