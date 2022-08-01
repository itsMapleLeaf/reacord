import { createElement } from "react"
import type { Node } from "./node.js"

export type ReacordElementHostProps = {
  factory: ReacordElementFactory
}

export function ReacordElement(props: {
  createNode: () => Node
  children?: React.ReactNode
}) {
  return createElement<ReacordElementHostProps>(
    "reacord-element",
    { factory: new ReacordElementFactory(props.createNode) },
    props.children,
  )
}

export class ReacordElementFactory {
  constructor(public readonly createNode: () => Node) {}

  static unwrap(maybeFactory: unknown): Node {
    if (maybeFactory instanceof ReacordElementFactory) {
      return maybeFactory.createNode()
    }
    const received = (maybeFactory as any)?.constructor.name
    throw new TypeError(
      `Expected a ${ReacordElementFactory.name}, got ${received}`,
    )
  }
}
