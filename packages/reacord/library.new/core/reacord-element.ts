import type { ReactNode } from "react"
import React from "react"
import type { Node } from "./node"
import { NodeRef } from "./node"

export function ReacordElement({
  node,
  children,
}: {
  node: Node
  children?: ReactNode
}) {
  return React.createElement(
    "reacord-element",
    { node: new NodeRef(node) },
    children,
  )
}
