import type { Container } from "./container"

export type NodeContainer = Container<Node<unknown>>

export type Node<Props> = {
  props?: Props
  children?: NodeContainer
}

export class TextNode implements Node<{ text: string }> {
  props: { text: string }
  constructor(text: string) {
    this.props = { text }
  }
}

export class NodeDefinition<Props> {
  static parse(value: unknown): NodeDefinition<unknown> {
    if (value instanceof NodeDefinition) {
      return value
    }
    const received = value as Object | null | undefined
    throw new TypeError(
      `Expected ${NodeDefinition.name}, received instance of ${received?.constructor.name}`,
    )
  }

  constructor(
    public readonly create: () => Node<Props>,
    public readonly props: Props,
  ) {}
}
